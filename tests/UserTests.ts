import { expect, assert } from 'chai';
import 'mocha';
import { User } from "../src/User";

describe('Test User Object', () => {
    it('should fail to create instance with no arguments', () => {
      // @ts-ignore <ts(2554)>
      expect(() => new User()).to.throw(Error);
    });

    it('should fail to create instance with null argument', () => {
      // @ts-ignore <ts(2345)>
      expect(() => new User(null)).to.throw(Error);
    });

    it('should fail to create instance with empty string', () => {
      expect(() => new User("")).to.throw(Error);
    });

    it('should fail to create instance with non string arguments', () => {
      // @ts-ignore <ts(2345)>
      expect(() => new User(123456)).to.throw(Error);
    });

    it('should return instance', () => { 
      const result = new User("unique-user-id");
      // expect(result).to.equal(true);
      assert.isDefined(result);
    }); 
});