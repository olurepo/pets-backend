/**
 * Abstract Class Controller.
 *
 * @class Controller
 */
class Controller {

    constructor() {
        if (this.constructor == Controller) {
        throw new Error("Abstract classes can't be instantiated.");
        }
    }
}

module.exports = Controller