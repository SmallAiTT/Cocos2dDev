/**
 * Created with JetBrains WebStorm.
 * User: small
 * Date: 13-9-6
 * Time: 下午2:59
 * To change this template use File | Settings | File Templates.
 */

dm.CacheNodeTestLayer1 = cc.Layer.extend({
    _mvSp : null,
    init : function(){
        this._super();
        var n = cc.CacheNode.create(Res.hero_border_1_png);
        n.setContentSize(cc.size(100, 100));
        this.addChild(n);
        n.setAnchorPoint(tt.ANCHOR_POINT_BL);
        var nSize = n.getContentSize();

        for(var i = 0; i < 10; ++i){
            for(var j = 0; j < 10; ++j){
                var sprite = cc.CacheNode.create(Res.hero_border_1_png);
//                n.addChild(sprite);
                sprite.setPosition(j * 20, i * 30);
                sprite.setAnchorPoint(tt.ANCHOR_POINT_BL);
            }
        }


        var n1 = cc.CacheNode.create(Res.hero_border_1_png);
        var n2 = cc.CacheNode.create(Res.hero_border_1_png);
        var n3 = cc.CacheNode.create(Res.hero_border_1_png);
//        n.addChild(n1);
//        n.addChild(n2);
        n.addChild(n3);
        n1.setPosition(nSize.width/2 - 100, nSize.height/2 - 20);
        n2.setPosition(nSize.width/2 + 100, nSize.height/2 - 20);
        n3.setPosition(nSize.width/2 - 0, nSize.height/2 - 20);
        n3.setPosition( 0, 0);

        n.setIsCacheNode(true);
//        n._dirtyType = cc.DIRTY_TYPE_POLLUTE;
//        n2._dirtyType = cc.DIRTY_TYPE_SRC;

        window.test = n;

        this.setTouchEnabled(true);

        this._mvSp = n3;
        this._act = cc.MoveBy.create(2, cc.p(200, 0));
        this._flag = 1;

        return true;
    },

    onTouchesEnded : function(touches, event){
        this._mvSp.setDirtySrc();
        var func = cc.CallFunc.create(function(){
            this._mvSp.clearDirtySrc();
        }.bind(this));
        if(this._flag == 1){
            var act = cc.Sequence.create(this._act.copy(), func);
            this._mvSp.runAction(act);
            this._flag *= -1;
        }else{
            var act = cc.Sequence.create(this._act.reverse(), func);
            this._mvSp.runAction(act);
            this._flag *= -1;
        }

    }
});
dm.CacheNodeTestLayer1.create = function(args){
    var layer = new dm.CacheNodeTestLayer1();
    return layer.init() ? layer : null;
};