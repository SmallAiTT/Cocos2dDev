/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-9-4
 * Time: 下午11:47
 * To change this template use File | Settings | File Templates.
 */


cc.DRAW_MODE_CACHE = 1;//缓存模式

cc.DIRTY_STATE_SRC = 1;//源头
cc.DIRTY_STATE_POLLUTE = 2;//污染

cc.Node = cc.Class.extend({
    _drawMode : null,//绘图模式
    _isRecache : true,
    _dirtyState : null,
    _bottomImg : null,
    _topImg : null,
    _sumImg : null,


    initImg : function(cxt, b, c, t){
        cxt.clearRect(0, 0, cxt.width, -cxt.height);
        cxt.save();
        cxt.translate(this._anchorPointInPoints.x, -(this._anchorPointInPoints.y ));
        if (b) {
            var l = b.length;
            for (var i = 0; i < l; i++) {
                b[i].visit(cxt);
            }
        }
        this.draw(cxt);
        if (t) {
            var l = t.length;
            for (var i = 0; i < l; i++) {
                t[i].visit(cxt);
            }
        }
        var data = cxt.toDataURL("png");
        cxt.restore();
        return data;
    },

    visit4Cache : function(cxt){
        //TODO 需要考虑层级关系
        //TODO 先对children进行排序
        //TODO 找出children中dirtyArr
        //TODO dirtyArr分为bottomDirtyArr以及topDirtyArr

        var bottomArr = [], topArr = [], bottomAppendArr = [], topAppendArr = [], bottomDirtyArr = [], topDirtyArr = [];

        if(this._isRecache){//TODO 第一次也要redraw，进行初始化
            //TODO 遍历bottomArr  非dirtySrc   ===>bottomImg || null
            //TODO 画自身
            //TODO 遍历topArr  非dirtySrc   ====>topImg || null
        }

        //TODO 处理污染者停止污染
        if(bottomAppendArr.length > 0){ //TODO 底部需要追加
            //TODO 追加到bottomImg中
        }
        if(topAppendArr.length > 0){
            //TODO 追加到topImg中
        }

        //TODO 处理污染者

    }
});