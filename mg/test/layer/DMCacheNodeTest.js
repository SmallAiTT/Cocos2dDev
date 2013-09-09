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
        var n = cc.Sprite.create(Res.map_background_jpg);
        this.addChild(n);
        n.setAnchorPoint(tt.ANCHOR_POINT_BL);
        var nSize = n.getContentSize();

        for(var i = 0; i < 10; ++i){
            for(var j = 0; j < 10; ++j){
                var sprite = cc.Sprite.create(Res.hero_border_1_png);
//                n.addChild(sprite);
                sprite.setPosition(j * 20, i * 30);
                sprite.setAnchorPoint(tt.ANCHOR_POINT_BL);
            }
        }


        var n1 = cc.Sprite.create(Res.hero_border_1_png);
//        n.addChild(n1);
        n1.setPosition(nSize.width/2 - 0, nSize.height/2 - 20);


        var n11 = cc.Sprite.create(Res.hero_border_1_png);
//        n1.addChild(n11);
        n11.setScale(0.5);


        //button control
        var btnHlBg = cc.Scale9Sprite.create(Res.button_062_png);

        var title = cc.LabelTTF.create("", "Marker Felt", 12);

        var button = cc.ControlButton.create(title, btnHlBg);
//        button.setBackgroundSpriteForState(btnHlBg, cc.CONTROL_STATE_HIGHLIGHTED);
        button.setTitleColorForState(cc.WHITE, cc.CONTROL_STATE_HIGHLIGHTED);
        button.setAnchorPoint(tt.ANCHOR_POINT_C);
        button.setPreferredSize(cc.size(62, 69));
        button.setPosition(0, 0);
        n.addChild(button);


        n.setIsCacheNode(true);

        this.setTouchEnabled(true);
        this._mvSp = n1;
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
