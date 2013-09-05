/**
 * Created with JetBrains WebStorm.
 * User: small
 * Date: 13-9-4
 * Time: 下午4:54
 * To change this template use File | Settings | File Templates.
 */

tt.CacheLayer = cc.Layer.extend({

    init : function(){
        this._super();

        var bg = cc.Sprite.create(Res.map_background_001_jpg);
        bg.setAnchorPoint(tt.ANCHOR_POINT_BL);
        this.addChild(bg);

        for(var i = 0; i < 10; ++i){
            for(var j = 0; j < 10; ++j){
                var sprite = cc.Sprite.create(Res.hero_border_1_png);
                this.addChild(sprite);
                sprite.setPosition(j * 20, i * 30);
                sprite.setAnchorPoint(tt.ANCHOR_POINT_BL);
            }
        }

        window.test = this;

        this._mvSp = cc.Sprite.create(Res.hero_border_1_png);
        this.addChild(this._mvSp);
        this._mvSp.setPosition(0, 400);
        this._mvSp.setAnchorPoint(tt.ANCHOR_POINT_BL);

        this._act = cc.MoveBy.create(2, cc.p(200, 0));

        this.setTouchEnabled(true);
        this.setAnchorPoint(tt.ANCHOR_POINT_BL);
        return true;
    },

    onTouchesEnded : function(touches, event){
        var func = cc.CallFunc.create(function(){
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


tt.CacheLayer.create = function(args){
    var layer = new tt.CacheLayer();
    layer.init();
    return layer;
}