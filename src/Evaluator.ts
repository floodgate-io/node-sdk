import * as Type from "./Types";
import * as Const from "./Consts";
// @ts-ignore <ts(7016)>
import * as sha1 from "js-sha1";
import { IUser, User } from "./User";

export interface IEvaluator {
  Evaluate(_key:string, _json: any, _defaultValue: any, _user?: IUser): any
}

export class Evaluator implements IEvaluator {
  public Evaluate(_key:string, _json: any, _defaultValue: any, _user?: IUser): any {
    // @ts-ignore <ts(2339)>
    const flags = Object.values(_json);

    // @ts-ignore <ts(2769)>
    const flag: any = flags.find((flag: { key: string; }) => flag.key === _key);

    if (flag === undefined || flag === null) {
      // No flag found, return default value
      return _defaultValue;
    }

    if (_user === undefined || _user === null) {
      // If flag is rollout but no user is present to evaluate,
      // return the default value
      if (flag['is_rollout']) {
        return _defaultValue;
      }

      return flag['value'];
    }

    if (!flag['is_targeting_enabled']) {
      // Evaluate rollouts
      if (flag['is_rollout']) {
        // return this.EvaluateRollout(_key, _user['id'], flag['rollouts'], _defaultValue);
        return this.EvaluateRollout(_key, _user.Id, flag['rollouts'], _defaultValue);
      }

      return flag['value'];
    }

    if (flag['is_targeting_enabled']) {
      return this.EvaluateTargets(_key, flag['targets'], _user, flag['value']);
    }

    return _defaultValue;
  }

  private EvaluateTargets(_key:string, _targets: any, _user: IUser, _defaultValue: any): any {
    // @ts-ignore <ts(2339)>
    const targets = Object.values(_targets);

    let value: any = _defaultValue;
    let ruleResult: boolean = false;
    let evaluates: boolean = true;
    let target: any;
    for (target of targets) {
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

    return _defaultValue;
  }

  private EvaluateRules(_rules: any, _user: IUser): boolean {
    // @ts-ignore <ts(2339)>
    const rules = Object.values(_rules);

    let result: boolean = false;
    let rule: any;

    for (rule of rules) {
      const userAttributeValue = this.GetUserAttributeValue(rule['attribute'], _user);
      if (!userAttributeValue) continue;
      
      const comparator = rule['comparator'];
      const values = rule['values'];

      switch (comparator) {
        case Const.COMPARATOR_EQUAL_TO:
          result = values.includes(userAttributeValue);
          break;
        case Const.COMPARATOR_NOT_EQUAL_TO:
            result = !values.includes(userAttributeValue);
          break;
        case Const.COMPARATOR_CONTAINS:
          for (const value of values) {
            result = userAttributeValue.includes(value);
            if (result) break;
          }
          break;
          case Const.COMPARATOR_NOT_CONTAIN:
            let valid = true;
            for (const value of values) {
              result = !userAttributeValue.includes(value);
              valid = result && valid;
            }

            result = valid;
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

  private GetUserAttributeValue(_key: string, _user: IUser): string | null {
    if (_key.toLowerCase() === "email" ) {
      return _user.Email;
    }

    if (_user.CustomAttributes && _user.CustomAttributes[_key.toLowerCase()].toLowerCase()) {
      return _user.CustomAttributes[_key];
    }

    return null;
  }
}