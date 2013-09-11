/**
 * Created with JetBrains WebStorm.
 * User: small
 * Date: 13-9-11
 * Time: 上午9:41
 * To change this template use File | Settings | File Templates.
 */

tt.NODE_TAG_INVALID = -1;
/**
 * Node on enter
 * @constant
 */
tt.NODE_ON_ENTER = null;
/**
 * Node on exit
 * @constant
 */
tt.NODE_ON_EXIT = null;

/**
 *  XXX: Yes, nodes might have a sort problem once every 15 days if the game runs at 60 FPS and each frame sprites are reordered.
 * @type Number
 */
tt.s_globalOrderOfArrival = 1;
tt.Node = cc.Class.extend({
    zOrder : 0,
    vertexZ : 0.0,
    rotationX : 0,
    rotationY : 0.0,
    scaleX : 1.0,
    scaleY : 1.0,
    position : null,
    skewX : 0.0,
    skewY : 0.0,

    children : null,
    isVisible : true,
    anchorPoint : null,
    anchorPointInPoints : null,
    contentSize : null,
    isRunning : false,
    parent : null,
    isIgnoreAnchorPointForPosition : false,
    tag : tt.NODE_TAG_INVALID,

    userData : null,
    userObject : null,
    isTransformDirty : true,
    isInverseDirty : true,
    isCacheDirty : true,
    transformGLDirty : null,
    transform : null,
    inverse : null,

    //since 2.0 api
    isReorderChildDirty : false,
    shaderProgram : null,
    orderOfArrival : 0,
    actionManager : null,
    scheduler : null,

    isInitializedNode : false,
    isAdditionalTransformDirty : false,
    additionalTransform : null,
    componentContainer : null,
    isTransitionFinished : false,

    rotationRadiansX : 0,
    rotationRadiansY : 0,


    _initNode : function(){
        this.anchorPoint = cc.p(0, 0);
        this.anchorPointInPoints = cc.p(0, 0);
        this.contentSize = cc.size(0, 0);
        this.position = cc.p(0, 0);
        this.children = [];

        var director = tt.Director.getInstance();
        this.actionManager = director.actionManager;
        this.scheduler = director.scheduler;
        this.isInitializedNode = true;
        this.additionalTransform = cc.AffineTransformMakeIdentity();
        this.componentContainer = new cc.ComponentContainer();
    },

    init : function() {
        if(this.isInitializedNode == false) this._initNode();
        return true;
    },

    _arrayMakeObjectPerformSelector : function(array, callbackType){
        if(!array || array.length === 0) return;
        var i, len = array.length, node, nodeCallbackType = tt.Node.StateCallbackType;
        switch(callbackType){
            case nodeCallbackType.onEnter :
                for (i = 0; i < len; i++) {
                    node = array[i];
                    if (node) node.onEnter();
                }
                break;
            case nodeCallbackType.onExit :
                for (i = 0; i < len; i++) {
                    node = array[i];
                    if (node) node.onExit();
                }
                break;
            case nodeCallbackType.onEnterTransitionDidFinish :
                for (i = 0; i < len; i++) {
                    node = array[i];
                    if (node) node.onEnterTransitionDidFinish();
                }
                break;
            case nodeCallbackType.cleanup :
                for (i = 0; i < len; i++) {
                    node = array[i];
                    if (node) node.cleanup();
                }
                break;
            case nodeCallbackType.updateTransform :
                for (i = 0; i < len; i++) {
                    node = array[i];
                    if (node) node.updateTransform();
                }
                break;
            case nodeCallbackType.onExitTransitionDidStart :
                for (i = 0; i < len; i++) {
                    node = array[i];
                    if (node) node.onExitTransitionDidStart();
                }
                break;
            case nodeCallbackType.sortAllChildren :
                for (i = 0; i < len; i++) {
                    node = array[i];
                    if (node) node.sortAllChildren();
                }
                break;
            default :
                throw "Unknown callback function";
                break;
        }
    },

    _setDirty4Canvas : function(){
        this._setDirty4Cache();
        if(this.isTransformDirty === false) this.isTransformDirty = this.isInverseDirty = true;
    },
    _setDirty4WebGL : function(){
        if(this.isTransformDirty === false) this.isTransformDirty = this.isInverseDirty = true;
    },

    setRotation : function (newRotation) {
        this.rotationX = this.rotationY = newRotation;
        this.rotationRadiansX = this.rotationX * 0.017453292519943295; //(Math.PI / 180);
        this.rotationRadiansY = this.rotationY * 0.017453292519943295; //(Math.PI / 180);
    },
    setRotationX : function (rotationX) {
        this.rotationX = rotationX;
        this.rotationRadiansX = this.rotationX * 0.017453292519943295; //(Math.PI / 180);
    },
    setRotationY : function (rotationY) {
        this.rotationY = rotationY;
        this.rotationRadiansY = this.rotationY * 0.017453292519943295;  //(Math.PI / 180);
    },
    setAnchorPoint : function (point) {
        var locAnchorPoint = this.anchorPoint;
        if (!cc.pointEqualToPoint(point, locAnchorPoint)) {
            locAnchorPoint.x =  point.x;
            locAnchorPoint.y = point.y;
            var locAPP = this.anchorPointInPoints, locSize = this.contentSize;
            locAPP.x = locSize.width * point.x;
            locAPP.y = locSize.height * point.y;
        }
    },
    /**
     * Desc: 此处返回的为clone数据。
     * @returns {number|Number|Number|Number|Number|string|string}
     */
    getContentSize : function () {
        return cc.size(this.contentSize.width, this.contentSize.height);
    },
    setContentSize:function (size) {
        var locContentSize = this.contentSize;
        if (!cc.sizeEqualToSize(size, locContentSize)) {
            locContentSize.width = size.width;
            locContentSize.height = size.height;
            var locAPP = this.anchorPointInPoints, locAnchorPoint = this.anchorPoint;
            locAPP.x = locContentSize.width * locAnchorPoint.x;
            locAPP.y = locContentSize.height * locAnchorPoint.y;
        }
    },
    getActionManager : function () {
        if (!this.actionManager) this.actionManager = cc.Director.getInstance().getActionManager();
        return this.actionManager;
    },
    setActionManager : function (actionManager) {
        if (this.actionManager != actionManager) {
            this.stopAllActions();
            this.actionManager = actionManager;
        }
    },
    getScheduler : function () {
        if (!this.scheduler) {
            this.scheduler = cc.Director.getInstance().getScheduler();
        }
        return this.scheduler;
    },
    setScheduler : function (scheduler) {
        if (this.scheduler != scheduler) {
            this.unscheduleAllCallbacks();
            this.scheduler = scheduler;
        }
    },
    getBoundingBox : function () {
        var rect = cc.rect(0, 0, this._contentSize.width, this._contentSize.height);
        return cc._RectApplyAffineTransformIn(rect, this.nodeToParentTransform());
    },
    cleanup:function () {
        // actions
        this.stopAllActions();
        this.unscheduleAllCallbacks();

        // timers
        this._arrayMakeObjectsPerformSelector(this.children, cc.Node.StateCallbackType.cleanup);
    },
    description : function () {
        return "<tt.Node | Tag =" + this._tag + ">";
    },

    getChildByTag : function (aTag) {
        //cc.Assert(aTag != cc.NODE_TAG_INVALID, "Invalid tag");
        var children = this.children;
        if (children != null) {
            for (var i = 0; i < children.length; i++) {
                var node = children[i];
                if (node && node.tag == aTag) return node;
            }
        }
        //throw "not found";
        return null;
    },
    addChild : function (child, zOrder, tag) {
        if (child === this) {
            console.warn('cc.Node.addChild: An Node can\'t be added as a child of itself.');
            return;
        }

        cc.Assert(child != null, "Argument must be non-nil");
        if (child._parent !== null) {
            cc.Assert(child.parent === null, "child already added. It can't be added again");
            return;
        }

        var tmpzOrder = (zOrder != null) ? zOrder : child.zOrder;
        child.tag = (tag != null) ? tag : child.tag;
        this.insertChild(child, tmpzOrder);
        child._parent = this;

        if (this.isRunning) {
            child.onEnter();
            // prevent onEnterTransitionDidFinish to be called twice when a node is added in onEnter
            if(this.isTransitionFinished)
                child.onEnterTransitionDidFinish();
        }
    },
    removeFromParent : function (cleanup) {
        if (this.parent) {
            if (cleanup == null) cleanup = true;
            this.parent.removeChild(this, cleanup);
        }
    },
    removeChild : function (child, cleanup) {
        // explicit nil handling
        if (this.children.length === 0) return;
        if (cleanup == null)
            cleanup = true;
        if (this.children.indexOf(child) > -1) this.detachChild(child, cleanup);
    },
    removeChildByTag:function (tag, cleanup) {
        cc.Assert(tag != cc.NODE_TAG_INVALID, "Invalid tag");
        var child = this.getChildByTag(tag);
        if (child == null) cc.log("cocos2d: removeChildByTag(tag = " + tag + "): child not found!");
        else this.removeChild(child, cleanup);
    },
    removeAllChildren:function (cleanup) {
        // not using detachChild improves speed here
        var children = this.children;
        if (children != null) {
            if (cleanup == null) cleanup = true;
            for (var i = 0; i < children.length; i++) {
                var node = children[i];
                if (node) {
                    // IMPORTANT:
                    //  -1st do onExit
                    //  -2nd cleanup
                    if (this.isRunning) {
                        node.onExitTransitionDidStart();
                        node.onExit();
                    }
                    if (cleanup) node.cleanup();
                    node.parent = null; // set parent nil at the end
                }
            }
            this.children.length = 0;
        }
    },
    _detachChild:function (child, doCleanup) {
        // IMPORTANT:
        //  -1st do onExit
        //  -2nd cleanup
        if (this.isRunning) {
            child.onExitTransitionDidStart();
            child.onExit();
        }

        // If you don't do cleanup, the child's actions will not get removed and the
        // its scheduledSelectors_ dict will not get released!
        if (doCleanup) child.cleanup();

        // set parent nil at the end
        child.parent = null;
        cc.ArrayRemoveObject(this.children, child);
    },
    _insertChild:function (child, z) {
        this.isReorderChildDirty = true;
        this.children.push(child);
        child.zOrder = z == null ? 0 : z;
    },
    reorderChild:function (child, zOrder) {
        cc.Assert(child != null, "Child must be non-nil");
        this.isReorderChildDirty = true;
        child = cc.s_globalOrderOfArrival++;
        child.zOrder = zOrder;
    },

    sortAllChildren:function () {
        if (this.isReorderChildDirty) {
            var children = this.children;
            var i, j, length = children.length,tempChild;

            // insertion sort
            for (i = 0; i < length; i++) {
                var tempItem = children[i];
                j = i - 1;
                tempChild =  children[j];

                //continue moving element downwards while zOrder is smaller or when zOrder is the same but mutatedIndex is smaller
                while (j >= 0 && ( tempItem.zOrder < tempChild.zOrder ||
                    ( tempItem.zOrder == tempChild.zOrder && tempItem.orderOfArrival < tempChild.orderOfArrival ))) {
                    children[j + 1] = tempChild;
                    j = j - 1;
                    tempChild =  children[j];
                }
                children[j + 1] = tempItem;
            }

            //don't need to check children recursively, that's done in visit of each child
            this.isReorderChildDirty = false;
        }
    },

    draw : function(){},

    transformAncestors:function () {
        if (this.parent != null) {
            this.parent.transformAncestors();
            this.parent.transform();
        }
    },
    onEnter:function () {
        this.isTransitionFinished = false;
        this.isRunning = true;//should be running before resumeSchedule
        this._arrayMakeObjectsPerformSelector(this.children, cc.Node.StateCallbackType.onEnter);
        this.resumeSchedulerAndActions();
    },

    onEnterTransitionDidFinish:function () {
        this.isTransitionFinished = true;
        this._arrayMakeObjectsPerformSelector(this.children, cc.Node.StateCallbackType.onEnterTransitionDidFinish);
    },

    onExitTransitionDidStart:function () {
        this._arrayMakeObjectsPerformSelector(this.children, cc.Node.StateCallbackType.onExitTransitionDidStart);
    },

    onExit:function () {
        this._running = false;
        this.pauseSchedulerAndActions();
        this._arrayMakeObjectsPerformSelector(this.children, cc.Node.StateCallbackType.onExit);
        this._componentContainer.removeAll();
    },
    runAction:function (action) {
        this.getActionManager().addAction(action, this, !this.isRunning);
        return action;
    },

    stopAllActions:function () {
        this.getActionManager().removeAllActionsFromTarget(this);
    },

    stopAction:function (action) {
        this.getActionManager().removeAction(action);
    },
    stopActionByTag:function (tag) {
        cc.Assert(tag != cc.ACTION_TAG_INVALID, "Invalid tag");
        this.getActionManager().removeActionByTag(tag, this);
    },
    getActionByTag:function (tag) {
        cc.Assert(tag != cc.ACTION_TAG_INVALID, "Invalid tag");
        return this.getActionManager().getActionByTag(tag, this);
    },
    numberOfRunningActions:function () {
        return this.getActionManager().numberOfRunningActionsInTarget(this);
    },

    scheduleUpdate:function () {
        this.scheduleUpdateWithPriority(0);
    },
    scheduleUpdateWithPriority:function (priority) {
        this.getScheduler().scheduleUpdateForTarget(this, priority, !this._running);
    },
    unscheduleUpdate:function () {
        this.getScheduler().unscheduleUpdateForTarget(this);
    },
    schedule:function (callback_fn, interval, repeat, delay) {
        interval = interval || 0;

        cc.Assert(callback_fn, "Argument must be non-nil");
        cc.Assert(interval >= 0, "Argument must be positive");

        repeat = (repeat == null) ? cc.REPEAT_FOREVER : repeat;
        delay = delay || 0;

        this.getScheduler().scheduleCallbackForTarget(this, callback_fn, interval, repeat, delay, !this._running);
    },
    scheduleOnce:function (callback_fn, delay) {
        this.schedule(callback_fn, 0.0, 0, delay);
    },
    unschedule:function (callback_fn) {
        // explicit nil handling
        if (!callback_fn)
            return;

        this.getScheduler().unscheduleCallbackForTarget(this, callback_fn);
    },
    unscheduleAllCallbacks:function () {
        this.getScheduler().unscheduleAllCallbacksForTarget(this);
    },

    resumeSchedulerAndActions:function () {
        this.getScheduler().resumeTarget(this);
        this.getActionManager().resumeTarget(this);
    },

    pauseSchedulerAndActions:function () {
        this.getScheduler().pauseTarget(this);
        this.getActionManager().pauseTarget(this);
    },
    setAdditionalTransform:function (additionalTransform) {
        this.additionalTransform = additionalTransform;
        this.isTransformDirty = true;
        this.isAdditionalTransformDirty = true;
    },
    parentToNodeTransform:function () {
        if (this.isInverseDirty) {
            this.inverse = cc.AffineTransformInvert(this.nodeToParentTransform());
            this.isInverseDirty = false;
        }
        return this.inverse;
    },
    nodeToWorldTransform:function () {
        var t = this.nodeToParentTransform();
        for (var p = this.parent; p != null; p = p.parent)
            t = cc.AffineTransformConcat(t, p.nodeToParentTransform());
        return t;
    },

    worldToNodeTransform:function () {
        return cc.AffineTransformInvert(this.nodeToWorldTransform());
    },
    convertToNodeSpace:function (worldPoint) {
        return cc.PointApplyAffineTransform(worldPoint, this.worldToNodeTransform());
    },
    convertToWorldSpace:function (nodePoint) {
        return cc.PointApplyAffineTransform(nodePoint, this.nodeToWorldTransform());
    },
    convertToNodeSpaceAR:function (worldPoint) {
        return cc.pSub(this.convertToNodeSpace(worldPoint), this.anchorPointInPoints);
    },
    convertToWorldSpaceAR:function (nodePoint) {
        var pt = cc.pAdd(nodePoint, this._anchorPointInPoints);
        return this.convertToWorldSpace(pt);
    },

    _convertToWindowSpace:function (nodePoint) {
        var worldPoint = this.convertToWorldSpace(nodePoint);
        return cc.Director.getInstance().convertToUI(worldPoint);
    },
    convertTouchToNodeSpace:function (touch) {
        var point = touch.getLocation();
        //TODO This point needn't convert to GL in HTML5
        //point = cc.Director.getInstance().convertToGL(point);
        return this.convertToNodeSpace(point);
    },
    convertTouchToNodeSpaceAR:function (touch) {
        var point = touch.getLocation();
        point = cc.Director.getInstance().convertToGL(point);
        return this.convertToNodeSpaceAR(point);
    },
    update:function (dt) {
        if(this.componentContainer && !this.componentContainer.isEmpty())
            this.componentContainer.visit(dt);
    },
    updateTransform:function () {
        // Recursively iterate over children
        this._arrayMakeObjectsPerformSelector(this.children, cc.Node.StateCallbackType.updateTransform);
    },
    retain:function () {
    },
    release:function () {
    },
    getComponent:function(name){
        return this.componentContainer.getComponent(name);
    },
    addComponent:function(component){
        this.componentContainer.add(component);
    },
    removeComponent:function(name){
        return this.componentContainer.remove(name);
    },
    removeAllComponents:function(){
        this._componentContainer.removeAll();
    },

    transform4x4 : null,
    stackMatrix : null,
    glServerState : null,
    camera : null,
    grid : null,

    ctor : null,
    _ctorForCanvas: function () {
        this._initNode();
    },

    _ctorForWebGL: function () {
        this._initNode();

        //WebGL
        var mat4 = new cc.kmMat4();
        mat4.mat[2] = mat4.mat[3] = mat4.mat[6] = mat4.mat[7] = mat4.mat[8] = mat4.mat[9] = mat4.mat[11] = mat4.mat[14] = 0.0;
        mat4.mat[10] = mat4.mat[15] = 1.0;
        this.transform4x4 = mat4;
        this.glServerState = 0;
        this.stackMatrix = new cc.kmMat4();
    },
    visit:null,
    _visitForCanvas:function (ctx) {
        // quick return if not visible
        if (!this.isVisible)
            return;

        //visit for canvas
        var context = ctx || cc.renderContext, i;
        var children = this.children,child;
        context.save();
        this.transform(context);
        var len = children.length;
        if (len > 0) {
            this.sortAllChildren();
            // draw children zOrder < 0
            for (i = 0; i < len; i++) {
                child = children[i];
                if (child.zOrder < 0)
                    child.visit(context);
                else
                    break;
            }
            this.draw(context);
            for (; i < len; i++) {
                children[i].visit(context);
            }
        } else
            this.draw(context);

        this.orderOfArrival = 0;
        context.restore();
    },

    _visitForWebGL: function(){
        // quick return if not visible
        if (!this.isVisible)
            return;
        var context = cc.renderContext, i, currentStack = cc.current_stack;

        //cc.kmGLPushMatrixWitMat4(this._stackMatrix);
        //optimize performance for javascript
        currentStack.stack.push(currentStack.top);
        cc.kmMat4Assign(this.stackMatrix, currentStack.top);
        currentStack.top = this.stackMatrix;

        var locGrid = this.grid;
        if (locGrid && locGrid.active)
            locGrid.beforeDraw();

        this.transform();

        var locChildren = this.children;
        if (locChildren && locChildren.length > 0) {
            var childLen = locChildren.length;
            this.sortAllChildren();
            // draw children zOrder < 0
            for (i = 0; i < childLen; i++) {
                if (locChildren[i] && locChildren[i]._zOrder < 0)
                    locChildren[i].visit();
                else
                    break;
            }
            this.draw(context);
            // draw children zOrder >= 0
            for (; i < childLen; i++) {
                if (locChildren[i]) {
                    locChildren[i].visit();
                }
            }
        } else
            this.draw(context);

        this.orderOfArrival = 0;
        if (locGrid && locGrid.active)
            locGrid.afterDraw(this);

        //cc.kmGLPopMatrix();
        //optimize performance for javascript
        currentStack.top = currentStack.stack.pop();
    },
    transform:null,

    _transformForCanvas: function (ctx) {
        // transform for canvas
        var context = ctx || cc.renderContext;
        var t = this.nodeToParentTransform();
        context.transform(t.a, t.b, t.c, t.d, t.tx, -t.ty);
    },

    _transformForWebGL: function () {
        //optimize performance for javascript
        var t4x4 = this.transform4x4,  topMat4 = cc.current_stack.top;

        // Convert 3x3 into 4x4 matrix
        //cc.CGAffineToGL(this.nodeToParentTransform(), this._transform4x4.mat);
        var trans = this.nodeToParentTransform();
        var t4x4Mat = t4x4.mat;
        t4x4Mat[0] = trans.a;
        t4x4Mat[4] = trans.c;
        t4x4Mat[12] = trans.tx;
        t4x4Mat[1] = trans.b;
        t4x4Mat[5] = trans.d;
        t4x4Mat[13] = trans.ty;

        // Update Z vertex manually
        //this._transform4x4.mat[14] = this._vertexZ;
        t4x4Mat[14] = this._vertexZ;

        //optimize performance for Javascript
        cc.kmMat4Multiply(topMat4, topMat4, t4x4); // = cc.kmGLMultMatrix(this._transform4x4);

        // XXX: Expensive calls. Camera should be integrated into the cached affine matrix
        if (this.camera != null && !(this.grid != null && this.grid.isActive())) {
            var apx = this.anchorPointInPoints.x, apy = this.anchorPointInPoints.y;
            var translate = (apx !== 0.0 || apy !== 0.0);
            if (translate){
                cc.kmGLTranslatef(cc.RENDER_IN_SUBPIXEL(apx), cc.RENDER_IN_SUBPIXEL(apy), 0);
                this.camera.locate();
                cc.kmGLTranslatef(cc.RENDER_IN_SUBPIXEL(-apx), cc.RENDER_IN_SUBPIXEL(-apy), 0);
            } else {
                this.camera.locate();
            }
        }
    },
    _setNodeDirtyForCache:function () {
        this.isCacheDirty = true;
        if (this.parent) {
            this.parent._setNodeDirtyForCache();
        }
    },
    getCamera:function () {
        if (!this.camera) {
            this.camera = new cc.Camera();
        }
        return this._camera;
    },
    getBoundingBoxToWorld:function () {
        var rect = cc.rect(0, 0, this.contentSize.width, this.contentSize.height);
        rect = cc.RectApplyAffineTransform(rect, this.nodeToWorldTransform());
        rect = cc.rect(0 | rect.x - 4, 0 | rect.y - 4, 0 | rect.width + 8, 0 | rect.height + 8);
        //query child's BoundingBox
        if (!this.children)
            return rect;

        var locChildren = this.children;
        for (var i = 0; i < locChildren.length; i++) {
            var child = locChildren[i];
            if (child && child.isVisible) {
                var childRect = child.getBoundingBoxToWorld();
                if (childRect)
                    rect = cc.rectUnion(rect, childRect);
            }
        }
        return rect;
    }

});
if(cc.Browser.supportWebGL){
    //WebGL
    cc.Node.prototype.ctor = cc.Node.prototype._ctorForWebGL;
    cc.Node.prototype.setNodeDirty = cc.Node.prototype._setNodeDirtyForWebGL;
    cc.Node.prototype.visit = cc.Node.prototype._visitForWebGL;
    cc.Node.prototype.transform = cc.Node.prototype._transformForWebGL;
    cc.Node.prototype.nodeToParentTransform = cc.Node.prototype._nodeToParentTransformForWebGL;
}else{
    //Canvas
    cc.Node.prototype.ctor = cc.Node.prototype._ctorForCanvas;
    cc.Node.prototype.setNodeDirty = cc.Node.prototype._setNodeDirtyForCanvas;
    cc.Node.prototype.visit = cc.Node.prototype._visitForCanvas;
    cc.Node.prototype.transform = cc.Node.prototype._transformForCanvas;
    cc.Node.prototype.nodeToParentTransform = cc.Node.prototype._nodeToParentTransformForCanvas;
}
cc.Node.create = function () {
    return new cc.Node();
};
tt.Node.StateCallbackType = {onEnter:1, onExit:2, cleanup:3, onEnterTransitionDidFinish:4, updateTransform:5, onExitTransitionDidStart:6, sortAllChildren:7};

tt.NodeRGBA = tt.Node.extend({
    isRGBAProtocol : true,
    displayedOpacity : 255,
    realOpacity : 255,
    displayedColor : null,
    realColor : null,
    isCascadeColorEnabled : false,
    isCascadeOpacityEnabled : false,
    isOpacityModifyRGB : false,

    ctor : function(){
        tt.Node.prototype.ctor.call(this);
        this.displayedOpacity = 255;
        this.realOpacity = 255;
        this.displayedColor = cc.WIDTH;
        this.realColor = cc.WIDTH;
        this.isCascadeColorEnabled = false;
        this.isCascadeOpacityEnabled = false;
    },

    setOpacity:function(opacity){
        this.displayedOpacity = this.realOpacity = opacity;

        if (this.isCascadeOpacityEnabled) {
            var parentOpacity = 255, locParent = this.parent;
            if (locParent && locParent.isRGBAProtocol && locParent.isCascadeOpacityEnabled)
                parentOpacity = locParent.displayedOpacity;
            this.updateDisplayedOpacity(parentOpacity);
        }
    },

    updateDisplayedOpacity:function(parentOpacity){
        this.displayedOpacity = this.realOpacity * parentOpacity/255.0;
        if (this.isCascadeOpacityEnabled) {
            var selChildren = this.children;
            for(var i = 0; i< selChildren.length;i++){
                var item = selChildren[i];
                if(item && item.isRGBAProtocol)
                    item.updateDisplayedOpacity(this.displayedOpacity);
            }
        }
    },
    getColor:function(){
        var locRealColor = this.realColor;
        return new cc.Color3B(locRealColor.r, locRealColor.g, locRealColor.b);
    },
    setColor:function(color){
        var locDisplayedColor = this.displayedColor, locRealColor = this.realColor;
        locDisplayedColor.r = color.r;
        locDisplayedColor.g = color.g;
        locDisplayedColor.b = color.b;
        locRealColor.r = color.r;
        locRealColor.g = color.g;
        locRealColor.b = color.b;

        if (this.isCascadeColorEnabled) {
            var parentColor = cc.white();
            var locParent =  this._parent;
            if (locParent && locParent.isRGBAProtocol &&  locParent.isCascadeColorEnabled())
                parentColor = locParent.displayedColor;
            this.updateDisplayedColor(parentColor);
        }
    },

    updateDisplayedColor:function(parentColor){
        var locDispColor = this.displayedColor, locRealColor = this.realColor;
        locDispColor.r = locRealColor.r * parentColor.r/255.0;
        locDispColor.g = locRealColor.g * parentColor.g/255.0;
        locDispColor.b = locRealColor.b * parentColor.b/255.0;

        if (this.isCascadeColorEnabled){
            var selChildren = this._children;
            for(var i = 0; i< selChildren.length;i++){
                var item = selChildren[i];
                if(item && item.isRGBAProtocol)
                    item.updateDisplayedColor(locDispColor);
            }
        }
    }

});