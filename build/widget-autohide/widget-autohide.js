YUI.add('widget-autohide', function(Y) {

var WIDGET_AUTOHIDE    = 'widgetAutohide',
    AUTOHIDE            = 'autohide',
    CLICK_OUTSIDE     = 'clickoutside',
    FOCUS_OUTSIDE     = 'focusoutside',
    PRESS_ESCAPE         = 'down:27',
    BIND_UI             = 'bindUI',
    SYNC_UI             = "syncUI",
    RENDERED            = "rendered",
    BOUNDING_BOX        = "boundingBox",
    VISIBLE             = "visible",
    HOST                = "host",
    CHANGE              = 'Change',

    getCN               = Y.ClassNameManager.getClassName;


WidgetAutohide = Y.Base.create(WIDGET_AUTOHIDE, Y.Plugin.Base, [], {

    // *** Instance Members *** //

    _uiHandles : null,

    // *** Lifecycle Methods *** //

    initializer : function (config) {

        this.afterHostMethod(BIND_UI, this.bindUI);
        this.afterHostMethod(SYNC_UI, this.syncUI);

        if (this.get(HOST).get(RENDERED)) {
            this.bindUI();
            this.syncUI();
        }
    },

    destructor : function () {

        this._detachUIHandles();
    },

    bindUI : function () {

        this.afterHostEvent(VISIBLE+CHANGE, this._afterHostVisibleChange);
    },

    syncUI : function () {

        this._uiSetHostVisible(this.get(HOST).get(VISIBLE));
    },

    // *** Private Methods *** //

    _uiSetHostVisible : function (visible) {

        if (visible) {
            //this._attachUIHandles();
            Y.later(1, this, '_attachUIHandles');
        } else {
            this._detachUIHandles();
        }
    },

    _attachUIHandles : function () {

        if (this._uiHandles) { return; }

        var host = this.get(HOST),
            bb = host.get(BOUNDING_BOX),
            hide = Y.bind(host.hide, host),
            uiHandles = [],
            self = this,
            hideOnUI = this.get('hideOnUI'),
            hideOnKeyPress = this.get('hideOnKeyPress'),
            doc = Y.one('document')
            i = 0;

            //push all UI events
            for (; i < hideOnUI.length; i++) {
                uiHandles.push(bb.on(hideOnUI[i], hide));
            }

            i = 0;

            //push all key press events
            for (; i < hideOnKeyPress.length; i++) {
                uiHandles.push(doc.on('key', hide, hideOnKeyPress[i]));
            }

        /*
        if (this.get(CLICKED_OUTSIDE)) {
            uiHandles.push(bb.on('clickoutside', hide));
        }

        if (this.get(FOCUSED_OUTSIDE)) {
            uiHandles.push(bb.on('focusoutside', hide));
        }

        if (this.get(PRESSED_ESCAPE)) {
            uiHandles.push(Y.one('document').on('key', hide, 'down:27'));
        }
        */

        this._uiHandles = uiHandles;
    },

    _detachUIHandles : function () {

        Y.each(this._uiHandles, function(h){
            h.detach();
        });
        this._uiHandles = null;
    },

    _afterHostVisibleChange : function (e) {

        this._uiSetHostVisible(e.newVal);
    }

}, {

    // *** Static *** //

    NS : AUTOHIDE,

    ATTRS : {

        hideOnUI: {
            value: [CLICK_OUTSIDE, FOCUS_OUTSIDE],
            validator: Y.Lang.isArray
        },

        hideOnKeyPress: {
            value: [PRESS_ESCAPE],
            validator: Y.Lang.isArray
        }
    }

});

Y.namespace("Plugin").Autohide = WidgetAutohide;


}, '@VERSION@' ,{requires:['base-build', 'widget', 'plugin', 'gallery-outside-events']});
