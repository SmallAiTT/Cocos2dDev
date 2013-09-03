/**
 * Created with JetBrains WebStorm.
 * User: small
 * Date: 13-9-3
 * Time: 上午11:44
 * To change this template use File | Settings | File Templates.
 */


tt.HeroListItem = cc.Node.extend({
    init : function(){
        this._super();
        this.setContentSize(cc.size(450, 110));
        var bg = cc.Sprite.create(Res.background_022_png);
//        bg.setPreferredSize(cc.size(450, 110));
        bg.setAnchorPoint(tt.ANCHOR_POINT_BL);
        this.addChild(bg);
        this.setAnchorPoint(tt.ANCHOR_POINT_C);
        window.test = this;
        return true;
    }
});

tt.HeroListItem.create = function(args){
    var item = new tt.HeroListItem();
    return item.init() ? item : null;
};