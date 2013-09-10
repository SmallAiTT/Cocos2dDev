/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-9-10
 * Time: 下午11:23
 * To change this template use File | Settings | File Templates.
 */

var cc = cc || {};

function ClassManager(){
    return arguments.callee.name || (arguments.callee.toString()).match(/^function ([^(]+)/)[1];
}