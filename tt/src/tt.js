/**
 * Created with JetBrains WebStorm.
 * User: Small
 * Date: 13-8-13
 * Time: 下午10:15
 * To change this template use File | Settings | File Templates.
 */

var tt = tt || {};
var ResCfg = ResCfg || {};
tt.cfg = ResCfg;
var dm = dm || {};


/**
 * Desc: put src (Array) into target (Array) from startIndex to endIndex.
 * @param {Array} target
 * @param {Array} src
 * @param {Integer||null} startIndex
 * @param {Integer||null} endIndex
 * @returns {*}
 */
tt.pushArr = function(target, src, startIndex, endIndex){
    startIndex = startIndex == null ? 0 : startIndex;
    endIndex = endIndex == null ? src.length : endIndex;
    for(var i = startIndex; i < endIndex; ++i){
        target.push(src[i]);
    }
    return target;
};

/**
 * Desc: log position.
 * @param pos
 * @param tag
 */
tt.logPos = function(pos, tag){
    var str = "position--->";
    str = tag == null ? str : "[" + tag + "]" + str;
    str += "(" + pos.x + ", " + pos.y + ")";
    if(cc) cc.log(str);
    else console.log(str);
};

/**
 * Desc: log size.
 * @param size
 * @param tag
 */
tt.logSize = function(size, tag){
    var str = "size--->";
    str = tag == null ? str : "[" + tag + "]" + str;
    str += "(" + size.width + ", " + size.height + ")";
    if(cc) cc.log(str);
    else console.log(str);
};

/**
 * Desc: log array.
 * @param arr
 * @param tag
 */
tt.logArr = function(arr, tag){
    tag = tag || "arr";
    arr.forEach(function(value, index){
        if(cc){
            cc.log(tag + "[" + index + "]--->");
            cc.log(value);
        }else{
            console.log(tag + "[" + index + "]--->");
            console.log(value);
        }
    });
};

/**
 * Desc: merge res info into target.
 * @param target
 * @param arr
 * @param store
 * @private
 */
tt._mergeResArr = function(target, arr, store){
    arr.forEach(function(value){
        if(value == null) return;
        value = typeof value == "string" ? {src : value} : value;
        if(store[value.src]) return;
        store[value.src] = true;
        target.push(value);
    });
};

/**
 * Desc: merge js path info into target.
 * @param target
 * @param arr
 * @param store
 * @private
 */
tt._mergeJsArr = function(target, arr, store){
    arr.forEach(function(value){
        if(value == null) return;
        store[value] = true;
        target.push(value);
    });
};

/**
 * Desc: get the res for loading.
 * @param loadResName
 * @param store
 * @returns {Array}
 */
tt.getLoadRes = function(loadResName, store){
    if(loadResName == null) return [];
    if(typeof loadResName != "string") throw "Argument should be String!"
    var loadRes = tt.cfg[loadResName];
    var resArr = [];
    store = store || {};
    if(loadRes != null){
        if(loadRes.ref != null){
            loadRes.ref.forEach(function(value, index){
                if(typeof value == "string"){
                    if(store[value]) return;
                    tt._mergeResArr(resArr, tt.getLoadRes(value, store), {});
                }else if(value instanceof Array){
                    tt._mergeResArr(resArr, value, store);
                }
            });
        }
        if(loadRes.res != null) tt._mergeResArr(resArr, loadRes.res, store);
    }
    if(loadResName.length > 5
        && loadResName.substring(loadResName.length - 5).toLowerCase() == ".ccbi"
        && store[loadResName] != true){
        resArr.push({src : loadResName})
    }
    store[loadResName] = true;
    return resArr;
};
/**
 * Desc: get js array 4 loading.
 * @param loadResName
 * @param type
 * @param store
 * @returns {Array}
 */
tt.getLoadJs = function(loadResName, type, store){
    if(loadResName == null) return [];
    if(typeof loadResName != "string") throw "Argument should be String!"
    var loadRes = tt.cfg[loadResName];
    var jsArr = [];
    store = store || {};
    if(loadRes != null){
        if(loadRes.ref != null){
            loadRes.ref.forEach(function(value, index){
                if(typeof value == "string"){
                    if(store[value] == true) return;
                    tt._mergeJsArr(jsArr, tt.getLoadJs(value, type, store), {});
                }
            });
        }
        if(loadRes[type] != null) tt._mergeJsArr(jsArr, loadRes[type], store);
    }
    if(type == "appFiles"
        && loadResName.length > 3
        && loadResName.substring(loadResName.length - 3).toLowerCase() == ".js"
        && store[loadResName] != true){
        jsArr.push(loadResName);
    }
    store[loadResName] = true;
    return jsArr;
};

/**
 * Desc: get app files 4 cfg.
 * @param key
 * @param files
 * @param type
 */
tt.getAppFiles = function(key, files, type){
    files = files || [];
    //获取到的数组是有先后顺序的
    var temp = tt.getLoadJs(key, type, {});
    temp.forEach(function(v, i){
        if(files.indexOf(v) < 0){
            files.push(v);
        }
    });
};
/**
 * Desc: init file path with dir.
 * @param arr
 * @param dir
 */
tt.initFilesByDir = function(arr, dir){
    if(!dir) return;
    arr.forEach(function(value, index){
        arr[index] = dir + value;
    });
};
/**
 * Desc: init cfg before loading.
 * @param cfg
 */
tt.initCfg = function(cfg){
    cfg.appFiles = cfg.appFiles || [];
    var ttFiles = [], appFiles = [], testFiles = [];
    if(cfg.runMode == "test"){
        ttFiles = tt.pushArr(ttFiles, tt.getLoadJs(cfg.testCfg, "ttFiles"));
        appFiles = tt.pushArr(appFiles, tt.getLoadJs(cfg.testCfg, "appFiles"));
        testFiles = tt.pushArr(testFiles, tt.getLoadJs(cfg.testCfg, "testFiles"));
        tt.initFilesByDir(ttFiles, cfg.ttDir);
        tt.initFilesByDir(appFiles, cfg.projectDir);
        tt.initFilesByDir(testFiles, cfg.testDir);
    }else{
        for(var key in tt.cfg){
            if(key == null || typeof key != "string") return;
            tt.getAppFiles(key, ttFiles, "ttFiles");
        }
        for(var key in tt.cfg){
            if(key == null || typeof key != "string") return;
            tt.getAppFiles(key, appFiles, "appFiles");
        }
        tt.initFilesByDir(ttFiles, cfg.ttDir);
        tt.initFilesByDir(appFiles, cfg.projectDir);
    }
    cfg.appFiles = cfg.appFiles.concat(ttFiles, appFiles, testFiles);
    if(cfg.gameVersion){
        cfg.appFiles.forEach(function(value, index){
            cfg.appFiles[index] = value + "?v=" + cfg.gameVersion;
        });
    }
};

tt.getClazz = function(clazzPath){
    var clazz = null;
    var arr = clazzPath.split(".");
    for(var i = 0; i < arr.length; ++i){
        clazz = clazz == null ? window[arr[i]] : clazz[arr[i]];
    }
    return clazz;
};

tt.testSprite = function(cfgName){

    tt.Layer4Test = tt.Layer4Test || cc.Layer.extend({
        init : function(spriteClazz, args){
            this._super();
            var node = spriteClazz.create(args);
            node.setAnchorPoint(cc.p(0.5, 0.5));
            this.addChild(node);
            var winSize = cc.Director.getInstance().getWinSize();
            node.setPosition(winSize.width/2, winSize.height/2);
            return true;
        }
    });
    tt.Layer4Test.create = tt.Layer4Test.create || function(spriteClazz, args){
        var layer = new tt.Layer4Test();
        return layer.init(spriteClazz, args) ? layer : null;
    };
    var cfg = ResCfg[cfgName];
    cfg.args = cfg.args || {};
    cc.LoaderScene.preload(tt.getLoadRes(cfgName), function(){
        var scene = cc.Scene.create();
        var clazz = tt.getClazz(cfg.sprite);
        scene.addChild(tt.Layer4Test.create(clazz, cfg.args || {}));
        cc.Director.getInstance().replaceScene(scene);
    });
};
tt.testLayer = function(cfgName){
    var cfg = ResCfg[cfgName];
    cfg.args = cfg.args || {};
    cc.LoaderScene.preload(tt.getLoadRes(cfgName), function(){
        var scene = cc.Scene.create();
        var clazz = tt.getClazz(cfg.layer);
        scene.addChild(clazz.create(cfg.args || {}));
        cc.Director.getInstance().replaceScene(scene);
    });
};
tt.testScene = function(cfgName){
    var cfg = ResCfg[cfgName];
    cfg.args = cfg.args || {};
    cc.LoaderScene.preload(tt.getLoadRes(cfgName), function(){
        var clazz = tt.getClazz(cfg.scene);
        var scene = clazz.create(cfg.args || {});
        cc.Director.getInstance().replaceScene(scene);
    });
};
tt.testCCBI = function(cfgName){
    var cfg = ResCfg[cfgName];
    cfg.args = cfg.args || {};
    cc.LoaderScene.preload(tt.getLoadRes(cfgName), function(){
        var node = cc.BuilderReader.load(cfgName);
        var scene = cc.Scene.create();
        if(node != null) scene.addChild(node);
        cc.Director.getInstance().replaceScene(scene);
    });
};

tt.test = function(cfgName){
    var cfg = ResCfg[cfgName];
    if(cfg.scene){
        tt.testScene(cfgName);
    }else if(cfg.layer){
        tt.testLayer(cfgName);
    }else if(cfg.sprite){
        tt.testSprite(cfgName);
    }else{
        tt.testCCBI(cfgName);
    }
};


tt.initBase = function(){
    tt.ANCHOR_POINT_TL = cc.p(0, 1);
    tt.ANCHOR_POINT_T = cc.p(0.5, 1);
    tt.ANCHOR_POINT_TR = cc.p(1, 1);
    tt.ANCHOR_POINT_L = cc.p(0, 0.5);
    tt.ANCHOR_POINT_C = cc.p(0.5, 0.5);
    tt.ANCHOR_POINT_R = cc.p(1, 0.5);
    tt.ANCHOR_POINT_BL = cc.p(0, 0);
    tt.ANCHOR_POINT_B = cc.p(0.5, 0);
    tt.ANCHOR_POINT_BR = cc.p(1, 0);
};