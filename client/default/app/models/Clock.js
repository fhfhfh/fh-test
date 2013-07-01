/*--------------------
    app/models/Calendar

    Module used to create Calendar elements within the app
--------------------*/
define(['jquery',
        'underscore',
        'backbone',
        'feedhenry'
], function($, _, Backbone, $fh) {


    //interface----------------------------------
    var clock = Backbone.Model.extend({

        running: false,
        sec: 0,
        min: 0,
        hour: 0,

        initialize: function(){

        },

        isRunning: function(){
            return this.running;
        },

        tick: function(){
            this.running = true;
            var sec = this.sec;
            var min = this.min;
            var hour = this.hour;

            sec++;
            if (sec == 60) {
                sec = 0;
                min = min + 1; }
            else {
                min = min; }
            if (min == 60) {
                min = 0;
                hour += 1;
            }

            this.hour = hour;
            this.min = min;
            this.sec = sec;

            if (sec<=9) {
                sec = "0" + sec;
            }
            if(min<=9){
                min = "0" + min;
            }
            if(hour<=9){
                hour = "0" + hour;
            }
            this.checkBeep();
            return hour + ":" + min + ":" + sec;
        },

        stop: function() {
            this.running = false;
        },

        reset: function(){
            this.running = false;
            this.sec = 0;
            this.min = 0;
            this.hour= 0;
        },

        checkBeep: function(){
            if(this.min%15===0){
                // attempt beep
                try{
                    navigator.notification.beep(2);
                } catch(e){
                    console.log(e);
                }
            }
        }
    });

    return clock;

});