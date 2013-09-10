/**
 * Created with JetBrains WebStorm.
 * User: small
 * Date: 13-9-2
 * Time: 下午2:05
 * To change this template use File | Settings | File Templates.
 */

dm.LoginLayer = cc.Layer.extend({
    className : 'dm_LoginLayer',
    _flag : true,
    _t : null,

    init : function(){
        this._super();
        var bg = cc.Sprite.create(Res.background_072_jpg);
        this.addChild(bg);
        bg.setPosition(cc.p(tt.WIN_SIZE.width/2, tt.WIN_SIZE.height/2));

        //control button
        this.createCtrlBtn(Res.btnbg_004_1_png, Res.btnbg_004_2_png, Res.btnbg_004_3_png,
            {
                title : "开始游戏", fntSize : 36
            },
            null, null, cc.p(100, 100), this
        );
        this.createCtrlBtn(Res.background_1000_png, null, null,
            {
                title : "开始游戏", fntSize : 36
            },
            null, null, cc.p(100, 450), this
        );
        this.createCtrlBtn(Res.background_1000_png, null, null,
            {
                title : "开始游戏", fntSize : 36
            },
            null, null, cc.p(100, 550), this
        );

        var t1 = cc.Sprite.create(Res.background_1000_png);
        this.addChild(t1);
        t1.setPosition(200, 200);
        var t2 = cc.Sprite.create(Res.btnbg_004_1_png);
        t1.addChild(t2);
        this._t = t1;

        this.setMouseEnabled(true);
        return true;
    },
    onMouseUp : function(event){
        if(this._flag) {
            this._t.removeFromParent();
            this._flag = false;
        }else{
            this.addChild(this._t);
            this._t.setPosition(200, 200);
            this._flag = true;
        }
    },
    createCtrlBtn : function(bg1, bg2, bg3, titleInfo, anchorPoint, size, pos, parent){
        var btnBg1 = cc.Scale9Sprite.create(bg1);
        var btnBg2 = cc.Scale9Sprite.create(bg2 || bg1);
        var btnBg3 = cc.Scale9Sprite.create(bg3 || bg1);

        var titleLabel = cc.LabelTTF.create(titleInfo.title || "", titleInfo.fnt || "Marker Felt", titleInfo.fntSize || 12);

        var button = cc.ControlButton.create(titleLabel, btnBg1);
        button.setBackgroundSpriteForState(btnBg2, cc.CONTROL_STATE_HIGHLIGHTED);
        button.setBackgroundSpriteForState(btnBg3, cc.CONTROL_STATE_DISABLED);
        button.setTitleColorForState(cc.WHITE, cc.CONTROL_STATE_HIGHLIGHTED);
        button.setAnchorPoint(anchorPoint || tt.ANCHOR_POINT_C);
        if(size) button.setPreferredSize();
        if(pos) button.setPosition(pos);
        if(parent) parent.addChild(button);
    }
});

dm.LoginLayer.create = function(args){
    var layer = new dm.LoginLayer();
    return layer.init() ? layer : null;
};
