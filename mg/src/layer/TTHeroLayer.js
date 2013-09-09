/**
 * Created with JetBrains WebStorm.
 * User: small
 * Date: 13-9-9
 * Time: 上午11:14
 * To change this template use File | Settings | File Templates.
 */

tt.HeroLayer = cc.Layer.extend({
    init : function(){
        this._super();

        var winSize = cc.Director.getInstance().getWinSize();

        //bg
        var bg = cc.Sprite.create(Res.background_029_jpg);
        this.addChild(bg);
        bg.setPosition(winSize.width/2, winSize.height/2);
        bg.visit();

        //hero
        var hero = cc.Sprite.create(Res.skin_hero_18_png);
        this.addChild(hero);
        hero.setPosition(winSize.width/2, winSize.height/2 + 50);

        //top bar
        var topBar = cc.Sprite.create(Res.background_010_png);
        topBarSize = topBar.getContentSize();

//        var topBarRT = cc.RenderTexture.create(topBarSize.width,topBarSize.height);
//        topBarRT.begin();
//        this.addChild(topBarRT);
//        topBar.setAnchorPoint(cc.p(0, 0));

        this.addChild(topBar);
        topBar.setPosition(winSize.width/2, winSize.height - topBarSize.height/2);

        var nameLabel = cc.LabelTTF.create("祝融夫人", "Courier-Blod", 36);
        topBar.addChild(nameLabel);
        var nameLabelSize = nameLabel.getContentSize();
        nameLabel.setPosition(topBarSize.width/2 - nameLabelSize.width/2 - 10, topBarSize.height/2);
        nameLabel.setColor(cc.c4b(0, 255, 255, 255));
        //add stars
        var starLevel = 3;
        var pX = topBarSize.width/2 + 30;
        for(var i = 0; i < 5; ++i){
            if(i >= starLevel) break;
            var star = cc.Sprite.create(Res.shape_011_png);
            var starSize = star.getContentSize();
            star.setPosition(pX + starSize.width * i + 5, topBarSize.height/2);
            topBar.addChild(star);
        }
        var heroCamp = cc.Sprite.create(Res.hero_camp_1_png);
        var heroCampSize = heroCamp.getContentSize();
        topBar.addChild(heroCamp);
        heroCamp.setPosition(winSize.width - heroCampSize.width/2 - 10, topBarSize.height/2);

//        topBar.visit();
//        topBarRT.end();
//        topBarRT.setPosition(winSize.width/2, winSize.height - topBarSize.height/2);

        //back btn
        var backBg = cc.Scale9Sprite.create(Res.button_038_png);
        var backBtn = cc.ControlButton.create();
        backBtn.setBackgroundSpriteForState(backBg, cc.CONTROL_STATE_NORMAL);
//        button.setBackgroundSpriteForState(backBg, cc.CONTROL_STATE_HIGHLIGHTED);
        backBtn.setAnchorPoint(tt.ANCHOR_POINT_C);
        backBtn.setPreferredSize(cc.size(72, 72));
        backBtn.setPosition(50, winSize.height - topBarSize.height/2);
        this.addChild(backBtn);

        //skill
        var posArr = [
            cc.p(80, 550), cc.p(400, 550),
            cc.p(80, 450), cc.p(400, 450),
            cc.p(80, 350), cc.p(400, 350)
        ];
        for(var i = 0; i < posArr.length; ++i){
            var skillBg = cc.Scale9Sprite.create(Res.background_016_png);
            var skillBtn = cc.ControlButton.create();
            skillBtn.setBackgroundSpriteForState(skillBg, cc.CONTROL_STATE_NORMAL);
            skillBtn.setPreferredSize(cc.size(72, 72));
            skillBtn.setPosition(posArr[i]);
            this.addChild(skillBtn);
        }

        //chg btn
        var chgBg1 = cc.Scale9Sprite.create(Res.btnbg_001_1_png);
        var chgBg2 = cc.Scale9Sprite.create(Res.btnbg_001_2_png);
        var chgBg3 = cc.Scale9Sprite.create(Res.btnbg_001_3_png);
        var chgLabel = cc.LabelTTF.create("更换", "Courier-Bold", 24);
        var chgBtn = cc.ControlButton.create(chgLabel, chgBg1);
        chgBtn.setBackgroundSpriteForState(chgBg2, cc.CONTROL_STATE_HIGHLIGHTED);
        chgBtn.setBackgroundSpriteForState(chgBg3, cc.CONTROL_STATE_DISABLED);
        chgBtn.setPreferredSize(cc.size(121, 56));
        chgBtn.setPosition(winSize.width/2 - 70, 250);
        this.addChild(chgBtn);

        //update btn
        var updateBg1 = cc.Scale9Sprite.create(Res.btnbg_001_1_png);
        var updateBg2 = cc.Scale9Sprite.create(Res.btnbg_001_2_png);
        var updateBg3 = cc.Scale9Sprite.create(Res.btnbg_001_3_png);
        var updateLabel = cc.LabelTTF.create("升级", "Courier-Bold", 24);
        var updateBtn = cc.ControlButton.create(updateLabel, updateBg1);
        updateBtn.setBackgroundSpriteForState(updateBg2, cc.CONTROL_STATE_HIGHLIGHTED);
        updateBtn.setBackgroundSpriteForState(updateBg3, cc.CONTROL_STATE_DISABLED);
        updateBtn.setPreferredSize(cc.size(121, 56));
        updateBtn.setPosition(winSize.width/2 + 70, 250);
        this.addChild(updateBtn);

        //info bar
        var infoBar = cc.Sprite.create(Res.background_030_png);
        var infoBarSize = infoBar.getContentSize();
        this.addChild(infoBar);
        infoBar.setPosition(winSize.width/2, 150);

//        infoBar.setPosition(infoBarSize.width/2, infoBarSize.height/2);
//        var infoBarRT = cc.RenderTexture.create(infoBarSize.width, infoBarSize.height);
//        this.addChild(infoBarRT);
//        infoBarRT.setPosition(winSize.width/2, 150);
//        infoBarRT.begin();

        var levelBarSp = cc.Sprite.create(Res.progress_005_png);
        var levelBarSp1 = cc.Sprite.create(Res.progress_006_png);
        var levelLabel = cc.LabelTTF.create("等级:182", "Courier-Bold", 18);
        var wlLabel = cc.LabelTTF.create("武力:1234", "Courier-Bold", 18);
        var levelDigitLabel = cc.LabelTTF.create("100000", "Courier-Bold", 18);
        var speedLabel = cc.LabelTTF.create("速度:1234", "Courier-Bold", 18);
        var zlLabel = cc.LabelTTF.create("战力:12345678", "Courier-Bold", 18);
        var tyLabel = cc.LabelTTF.create("统御:1234", "Courier-Bold", 14);
        infoBar.addChild(levelBarSp);
        infoBar.addChild(levelBarSp1);
        infoBar.addChild(levelLabel);
        infoBar.addChild(wlLabel);
        infoBar.addChild(levelDigitLabel);
        infoBar.addChild(speedLabel);
        infoBar.addChild(zlLabel);
        infoBar.addChild(tyLabel);
        levelBarSp.setPosition(infoBarSize.width/2 - 70, infoBarSize.height/2);
        levelBarSp1.setPosition(infoBarSize.width/2 - 70, infoBarSize.height/2);
        levelLabel.setPosition(infoBarSize.width/2 - 70, infoBarSize.height/2 + 25);
        wlLabel.setPosition(infoBarSize.width/2 + 70, infoBarSize.height/2 + 25);
        levelDigitLabel.setPosition(infoBarSize.width/2 - 70, infoBarSize.height/2);
        speedLabel.setPosition(infoBarSize.width/2 + 70, infoBarSize.height/2);
        zlLabel.setPosition(infoBarSize.width/2 - 70, infoBarSize.height/2 - 25);
        tyLabel.setPosition(infoBarSize.width/2 + 70, infoBarSize.height/2 - 25);


        var armsSp = cc.Sprite.create(Res.arms_full_1_png);
        infoBar.addChild(armsSp);
        armsSp.setPosition(60, infoBarSize.height/2);
        var xfBg = cc.Scale9Sprite.create(Res.button_049_png);
        var xfBtn = cc.ControlButton.create();
        xfBtn.setBackgroundSpriteForState(xfBg, cc.CONTROL_STATE_HIGHLIGHTED);
        xfBtn.setPreferredSize(armsSp.getContentSize());
        xfBtn.setPosition(60, infoBarSize.height/2);
        infoBar.addChild(xfBtn);

        var jyBg = cc.Scale9Sprite.create(Res.shape_006_png);
//        var jyBtn = cc.ControlButton.create();
//        jyBtn.setBackgroundSpriteForState(jyBg, cc.CONTROL_STATE_HIGHLIGHTED);
//        jyBtn.setPreferredSize(cc.size(34, 62));
        jyBg.setPosition(infoBarSize.width - 60, infoBarSize.height/2);
        infoBar.addChild(jyBg);

//        infoBar.visit();
//        infoBarRT.end();


        //bottom bar
        this.btnBar = tt.BtnBar.create({
            bg : Res.background_014_png,
            btnInfos : [
                {btns : [Res.button_062_png], pos : {x : 50, y : 40}},
                {btns : [Res.button_064_png], pos : {x : 130, y : 40}},
                {btns : [Res.button_065_png], pos : {x : 210, y : 40}},
                {btns : [Res.button_063_png], pos : {x : 290, y : 40}},
                {btns : [Res.button_066_png], pos : {x : 370, y : 40}},
                {btns : [Res.button_067_png], pos : {x : 440, y : 40}}
            ]
        });
        this.addChild(this.btnBar);
        var btnBarSize = this.btnBar.getContentSize();
        this.btnBar.setPosition(tt.WIN_SIZE.width/2, btnBarSize.height/2);

//        this.setTouchEnabled(true);
        return true;
    },

    onTouchesEnded : function(touches, event){
        var action = cc.MoveBy.create(2, cc.p(200, 0));
        topBarRT.runAction(action);
    }
});

tt.HeroLayer.create = function(args){
    var layer = new tt.HeroLayer();
    return layer.init() ? layer : null;
};