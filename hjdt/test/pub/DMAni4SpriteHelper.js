/**
 * Created with JetBrains WebStorm.
 * User: small
 * Date: 13-9-17
 * Time: 上午10:39
 * To change this template use File | Settings | File Templates.
 */

dm.Ani4SpriteHelper = cc.Layer.extend({
    init : function(){
        this._super();

        var sprite = cc.Sprite.create();

        var animCache = cc.AnimationCache.getInstance();

        animCache.addAnimations(Res.bomb_ani_plist);
        var animation2 = animCache.getAnimation("bomb01");
        animation2.setRestoreOriginalFrame(true);

        var action2 = cc.Animate.create(animation2);
        sprite.runAction(cc.Sequence.create(action2));

        this.addChild(sprite);
        sprite.setPosition(tt.WIN_CENTER);

        return true;
    }
});

dm.Ani4SpriteHelper.create = function(args){
    var layer = new dm.Ani4SpriteHelper();
    return layer.init() ? layer : null;
};