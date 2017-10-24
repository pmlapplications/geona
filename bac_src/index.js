
export default class BacTest {
  constructor(name) {
    this.name = name;
    this.me = {};

    this.me.task = 'Fix things';
    this.me.how = (stick) => {
      return stick * 3;
    };
    this.me.other = () => {
      return 42;
    };
    // return this;
  }
}
