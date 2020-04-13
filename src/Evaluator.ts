import * as Type from "./Types";
import * as Const from "./Consts";
// @ts-ignore <ts(7016)>
import * as sha1 from "js-sha1";
import { IUser, User } from "./User";
import ILogger from "./ILogger";

export interface IEvaluator {
  Evaluate(_key:string, _json: any, _defaultValue: any, _user?: IUser): any
}

export class Evaluator implements IEvaluator {
  private logger: ILogger;

  constructor(_logger: ILogger) {
    this.logger = _logger;
  }

  public Evaluate(_key:string, _json: any, _defaultValue: any, _user?: IUser): any {


    // @ts-ignore <ts(2339)>
    const flags = Object.values(_json);

    // @ts-ignore <ts(2769)>
    const flag: any = flags.find((flag: { key: string; }) => flag.key === _key);

    if (flag === undefined || flag === null) {
      this.logger.Log(`No flag data available, returning default SDK value: ${_defaultValue}`);
      // No flag found, return default value
      return _defaultValue;
    }

    if (_user === undefined || _user === null) {
      this.logger.Log(`No user data available, returning default flag value: ${flag['value']}`);
      // If user is null then cannot evaluate targets or rollouts, return the flag default value
      return flag['value'];
    }

    if (!flag['is_targeting_enabled']) {
      // Evaluate rollouts
      if (flag['is_rollout']) {
        const rolloutResult = this.EvaluateRollout(_key, _user.Id, flag['rollouts'], flag['value']);
        this.logger.Log(`Rollout data available, returning rollout value: ${rolloutResult}`);
        return rolloutResult;
      }

      this.logger.Log(`No targeting or rollout data available, returning default flag value: ${flag['value']}`);
      return flag['value'];
    }

    if (flag['is_targeting_enabled']) {
      const targetResult = this.EvaluateTargets(_key, flag, _user, flag['value']);
      this.logger.Log(`Target data available, returning target value: ${targetResult}`);
      return targetResult;
    }

    this.logger.Log(`Returning default value: ${_defaultValue}`);
    return _defaultValue;
  }

  private EvaluateTargets(_key:string, _flag: any, _user: IUser, _defaultValue: any): any {
    // @ts-ignore <ts(2339)>
    const targets = Object.values(_flag['targets']);

    let value: any = _defaultValue;
    let ruleResult: boolean = false;
    let evaluates: boolean;
    let target: any;

    for (target of targets) {
      evaluates = true;

      value = target['value'];

      if (target['rules']) {
        ruleResult = this.EvaluateRules(target['rules'], _user);
        evaluates = evaluates && ruleResult;
      }

      if (evaluates) {
        if (target['is_rollout']) {
          return this.EvaluateRollout(
            _key,
            _user.Id,
            target['rollouts'],
            _defaultValue);
        }
  
        return value;
      }
    }

    if (_flag['is_rollout']) {
      return this.EvaluateRollout(
        _key,
        _user.Id,
        _flag['rollouts'],
        _defaultValue);
    }

    return _defaultValue;
  }

  private EvaluateRules(_rules: any, _user: IUser): boolean {
    // @ts-ignore <ts(2339)>
    const rules = Object.values(_rules);

    let result: boolean = false;
    let rule: any;

    for (rule of rules) {
      const userAttributeValue = this.GetUserAttributeValue(rule['attribute'], _user);

      if (!userAttributeValue || userAttributeValue === undefined) {
        result = false;
        continue;
      }

      const comparator = rule['comparator'];
      const values = rule['values'];

      this.logger.Log(`Comparator = ${comparator}`);

      switch (comparator) {
        case Const.COMPARATOR_EQUAL_TO:
          this.logger.Log(`Comparator = COMPARATOR_EQUAL_TO : ${Const.COMPARATOR_EQUAL_TO}`);

          result = values.map((v: string) => v.toLowerCase())
                         .includes(userAttributeValue.toLowerCase());
          break;
        case Const.COMPARATOR_NOT_EQUAL_TO:
          this.logger.Log(`Comparator = COMPARATOR_NOT_EQUAL_TO : ${Const.COMPARATOR_NOT_EQUAL_TO}`);

          result = !values.includes(userAttributeValue.toLowerCase());
          break;
        case Const.COMPARATOR_GREATER:
          this.logger.Log(`Comparator = COMPARATOR_GREATER : ${Const.COMPARATOR_GREATER}`);

          result = false;

          // If there are more than one values, take only the first one
          if (!values || values.length == 0)
            break;

          const greater = values[0];

          if (Number(userAttributeValue) > Number(greater)) {
            result = true;
          }
          break;
        case Const.COMPARATOR_GREATER_EQUAL_TO:
          this.logger.Log(`Comparator = COMPARATOR_GREATER_EQUAL_TO : ${Const.COMPARATOR_GREATER_EQUAL_TO}`);

          result = false;

          // If there are more than one values, take only the first one
          if (!values || values.length == 0)
            break;

          const greaterEqual = values[0];

          if (Number(userAttributeValue) >= Number(greaterEqual)) {
            result = true;
          }
          break;
        case Const.COMPARATOR_LESS:
          this.logger.Log(`Comparator = COMPARATOR_LESS : ${Const.COMPARATOR_LESS}`);

          result = false;

          // If there are more than one values, take only the first one
          if (!values || values.length == 0)
            break;

          const less = values[0];

          if (Number(userAttributeValue) < Number(less)) {
            result = true;
          }
          break;
        case Const.COMPARATOR_LESS_EQUAL_TO:
          this.logger.Log(`Comparator = COMPARATOR_LESS_EQUAL_TO : ${Const.COMPARATOR_LESS_EQUAL_TO}`);

          result = false;

          // If there are more than one values, take only the first one
          if (!values || values.length == 0)
            break;

          const lessEqual = values[0];

          if (Number(userAttributeValue) <= Number(lessEqual)) {
            result = true;
          }
          break;
        case Const.COMPARATOR_CONTAINS:
          this.logger.Log(`Comparator = COMPARATOR_CONTAINS : ${Const.COMPARATOR_CONTAINS}`);

          result = false;

          for (const value of values) {
            result = userAttributeValue.toLowerCase().includes(value.toLowerCase());
            if (result) break;
          }
          break;
        case Const.COMPARATOR_NOT_CONTAIN:
          this.logger.Log(`Comparator = COMPARATOR_NOT_CONTAIN : ${Const.COMPARATOR_NOT_CONTAIN}`);

          let valid = true;
          for (const value of values) {
            result = !userAttributeValue.toLowerCase().includes(value.toLowerCase());
            valid = result && valid;
          }

          result = valid;
          break;
        case Const.COMPARATOR_ENDS_WITH:
          this.logger.Log(`Comparator = COMPARATOR_ENDS_WITH : ${Const.COMPARATOR_ENDS_WITH}`);

          result = false;

          for (const value of values) {
            result = userAttributeValue.toLowerCase().endsWith(value.toLowerCase());
            if (result) break;
          }
          break;
        default:
          result = false;
          break;
      }
    }

    return result;
  }

  private EvaluateRollout(_key: string, _userId: string, _rollouts: any, _defaultValue: any): string {
    let rolloutValue: any = _defaultValue;
    let rolloutLowerLimit: number = 0;
    let rolloutUpperLimit: number = 0;

    let scale: number = this.GetScale(_key, _userId);

    for (const rollout of _rollouts) {
      rolloutUpperLimit = rolloutUpperLimit + parseInt(rollout['percentage']);

      if (scale > rolloutLowerLimit && scale <= rolloutUpperLimit) {
        rolloutValue = rollout['value'];
        break;
      }

      rolloutLowerLimit = rolloutLowerLimit + parseInt(rollout['percentage']);
    }

    return rolloutValue;
  }
  
  private GetScale(_key:string, _userId: string): number {
    const hashString: string = _key + _userId;
    const hash: any = sha1.hex(hashString).substring(0, 7);
    const scale: number = parseInt(hash, 16) % 100;
    return scale;
  }

  private GetUserAttributeValue(_key: string, _user: IUser): string | null | undefined {

    if (_key.toLowerCase() == "email" ) {
      return _user.Email;
    }

    if (_key.toLowerCase() == "name" ) {
      return _user.Name;
    }

    if (_user.CustomAttributes && _user.CustomAttributes[_key.toLowerCase()]) {
      return String(_user.CustomAttributes[_key.toLowerCase()]);
    }

    return null;
  }
}