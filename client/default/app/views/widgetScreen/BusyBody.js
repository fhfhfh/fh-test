/**
 * @fileOverview The Foodometer Widget
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/widgets/BusyBody.html',
    'text!templates/popups/MonthPicker.html',
    'text!templates/widgets/FoodItem.html',
    'models/Calendar',
    'collections/ActivityJournal',
    'models/Acts'
], function($, _, Backbone, tpl, monthPicker, item, calendar, collection, Act) {
    return Backbone.View.extend({
        tagName: 'section',
        id: 'busyBody',
        template: _.template(tpl),
        monthTpl: _.template(monthPicker),
        activityItemTpl: _.template(item),
        events: {
            'click #monthPick': 'showMonthPicker',
            'click td'        : 'selectDay',
            'click #back'     : 'prevMonth',
            'click #forward'  : 'nextMonth',
            'click .time'     : 'showTimeScreen',
            'click #share'    : 'shareFunction',
            'click #add'      : 'showAddPopup',
            'click #addFood'  : 'addActivityItem',
            'click #copyFood' : 'copyActivityItem',
            'click #clearFood': 'clearActivity',
            'click #nutrition': 'showNutrition',
            'click #foodList .boxEntry' : 'showActivityItem',
            'click #cancelFood' : 'closeActivityItem',
            'click #editItem' : 'editActivityItem',
            'click #deleteItem': 'deleteActivityItem'
          },

        initialize: function() {
            var date      = new Date();
            this.date     = date;
            this.month    = date.getMonth();
            this.day      = date.getDay();
            this.year     = date.getFullYear();
            this.calendar = new calendar();
            _.bindAll(this);
        },

        render: function() {
            this.$el.html(this.template());
            this.renderCal();
            this.renderDay();
            return this;
        },

        renderCal: function(date){
            date        = date || new Date();
            date.setMonth(this.month);
            date.setFullYear(this.year);
            var todaysDate  = new Date();
            var self        = this;
            var days        = this.$('.days td');
            var first       = this.calendar.getFirstDay(date);
            var today       = new Date().getDate();
            var cls         = '';
            var monthLength = this.calendar.daysInMonth(self.month, self.year);
            var num         = 1;
            $(days).html('');
            $(days).removeClass('today');

            for(var i=first; i<monthLength + first ; i++){
                var model = null;
                var dateNumber = new Date(date.setDate(num));
                if(num == today && this.month == todaysDate.getMonth() && this.year == todaysDate.getFullYear()){
                    cls = 'today';
                }
                else {
                    cls = '';
                }
                 model = collection.find(function(item){
                    return item.get('date').toDateString() == dateNumber.toDateString();
                });

                if(model !== null && model !== undefined && !model.isEmpty()){
                    $(days[i]).css("background-image", "url('../img/calendar/FaceHappy.png')");
                    $(days[i]).css("background-position", "10px 10px");
                    $(days[i]).css("background-repeat", "no-repeat no-repeat");
                }
                $(days[i]).html("<div class='day'>" + num + "</div>");
                $(days[i]).addClass(cls);
                num = num +1;
            }

            var dayStr = this.calendar.getDayStr(self.day);
            var monthStr = this.calendar.getMonthStr(self.month);
            this.$("#dateString").html( dayStr +', '+monthStr+ " " + today + ", "+this.year);
        },

        showMonthPicker: function(){
            var self = this;
            // close existing popup
            if($('div #filterView').length > 0){
                $('div #filterView').toggle();
                return;
            }
            else {
                $('#foodometer').append(self.monthTpl());
                $("#month").html(this.calendar.monthName[this.month]+", "+this.year);
                $('#back').unbind().bind('click', function(){
                    self.prevMonth();
                });
                $('#forward').unbind().bind('click', function(){
                    self.nextMonth();
                });
            }
        },

        selectDay: function(e){
            var target = e.currentTarget;
            var month  = this.month;
            var day    = $(target).text();
            var year   = this.year;
            var date   = new Date(year, month, day);
            var dayNum = date.getDay();
            var dayStr = this.calendar.getDayStr(dayNum);
            var monthStr = this.calendar.getMonthStr(this.month);

            // close month picker if its open
            if($('div #filterView').length > 0){
                $('div #filterView').hide();
            }
            // remove selected class from any meals
            this.$('.time').removeClass('selected');
            $("#nutritionSection").hide();
            $('#foodItemScreen').remove();

            $("#dateString").html( dayStr +', '+monthStr+ " " + day + ", "+this.year);
            $('.days td').removeClass('selected');
            $(target).addClass('selected');

            this.renderDay(date);
        },

        prevMonth: function(){
            var date        = new Date();
            if(this.month<=0 )
            {
                this.month = 12;
                this.year = this.year-1;
            }
            this.month = this.month-1;
            $("#month").html(this.calendar.monthName[this.month]+", "+this.year);
            this.renderCal();
        },

        nextMonth: function(){
            var date = new Date();
            if(this.month>=11 )
            {
                this.month = -1;
                this.year = this.year+1;
            }
            this.month = this.month+1;
            $("#month").html(this.calendar.monthName[this.month]+", "+this.year);
            this.renderCal();
        },

        renderDay: function(date){
            var self = this;
            date = date || new Date();
            var dayModel = collection.find(function(item){
                return item.get('date').toDateString() == date.toDateString();
            });
            self.item = null;
            if(dayModel){ // check if model exists for selected date
                self.item = dayModel; // make model globally accessible 
                if(self.item.isEmpty()){ // check if model has any food entries
                    self.showEmptyScreen();
                } else {
                    self.showMealScreen();
                }
            }
            else {
                self.item = collection.createDay(date);
                self.showEmptyScreen(); // if no model exists for date, assume empty
            }
        },

        showTimeScreen: function(e){
            var target = (e) ? e.currentTarget : '.time[data-name="morning"]';
            var time = this.$(target).attr('data-name') || 'morning';
            this.time = time;
            // change item class to selected
            this.$('.time').removeClass('selected');
            this.$(target).addClass('selected');

            var dateString = this.$('#dateString').text();
            var activityString = 'My ' + time.substring(0,1).toUpperCase() + time.substring(1,time.length);

            this.$('#activityContainer').show();
            this.$('#emptyDay').hide();
            this.$('#foodItemScreen').remove();

            this.$('#activityString').text(activityString);
            this.$('#foodList .boxHeader span').text(dateString);
            this.populateTime(time);
        },

        showEmptyScreen: function(){
            this.$('#activityContainer').hide();
            this.$('#emptyDay').show();
        },

        saveActivitiesToJournal: function(){
            var self = this;
            var activityArr = this.container.activityItems;
            if(activityArr.length > 0){
                var time = self.time;
                for(var i=0;i<activityArr.length;i++){
                    var arr = self.item.attributes[time];
                    arr.push(activityArr[i].attributes);
                    self.item.set(time, arr);
                    self.item.recalculateNutrients();
                }
                this.container.activityItems = [];
                this.populateTime(time);
            }
        },

        populateTime: function(time){
            this.$('#foodList .boxEntry').remove();
            var item = this.item;
            var self = this;
            if(item && time){
                var activities = item.attributes[time];
                if(activities.length === 0){
                    this.$('#calCount').text("");
                    this.$('#location').val("");
                    this.$('#with').val("");
                    this.$('#time').val("");
                    this.$('#notes').val("");
                    this.$('#goalNum').text("");
                    this.$('#currentNum').text("");
                    this.$('#remainingNum').text("");
                    return;
                }
                // loop starts at 1 as first entry is activity details (calories, notes, etc.)
                for(var i=1;i<activities.length;i++){
                    var index = activities[i];
                    var html = '<div class="boxEntry" data-id="'+index.id+'">'+
                        '<span id="name">'+ index.name+'</span>'+
                        '<span id="about">'+index.serving+'</span>'+
                        '</div>';
                    this.$('#foodList').append(html);
                }

                // populate meal info
                var activityInfo = activities[0];

                this.$('#calCount').text(activityInfo.calories + ' Calories Burned');
                this.$('#location').val(activityInfo.location);
                this.$('#with').val(activityInfo.with);
                this.$('#time').val(activityInfo.time);
                this.$('#notes').val(activityInfo.notes);

                this.$('.time[data-name=afternoon] .count').html(activityInfo.calories + ' Calories');

                // populate calorie counter
                var att = item.attributes;
                this.$('#goalNum').text(att.goalCals + ' Calories');
                this.$('#currentNum').text(att.currentCals + ' Calories');
                this.$('#remainingNum').text(att.remainingCals + ' Calories');

            }
            else {
                this.$('#calCount').text("");
                this.$('#location').val("");
                this.$('#with').val("");
                this.$('#time').val("");
                this.$('#notes').val("");
                this.$('#goalNum').text("");
                this.$('#currentNum').text("");
                this.$('#remainingNum').text("");
            }
            this.container.refreshScroll();
        },

        shareFunction: function(){
            console.log('share function...');
            console.log(this.item);
            collection.saveToCloud(this.item);

        },

        showAddPopup: function(){
              // Act.call('createDBAction',{},
              //    function(res){
              //      alert('Saved successfully'+JSON.stringify(res));
              //    }, function(err, msg){
              //      console.log(JSON.stringify(msg));
              //   });
            navigator.notification.beep(5);
            $('#add').toggleClass('selected');
            $('#addActivityPopup').toggle();
        },

        addActivityItem: function(){
            this.time = $(".time.selected").attr('data-name') || "morning";
            this.container.time = this.time.slice(0,1).toUpperCase() + this.time.slice(1,this.time.length);
            console.log(this.time);
            this.container.setActiveView('activityScreen');
        },

        copyActivityItem: function(){
            var date = new Date();
            var d2 = new Date();
            var time = $(".time.selected").attr('data-name') || "morning";

            date.setDate(date.getDate() - 1);

            var yesterdayModel = collection.find(function(item){
                return item.get('date').toDateString() == date.toDateString();
            });
            var todayModel = collection.find(function(item){
                return item.get('date').toDateString() == d2.toDateString();
            });

            if(!todayModel){
                yesterdayModel.attributes.date = new Date();
                collection.createDay(date, yesterdayModel);
            } else {
                todayModel.set(time, yesterdayModel.attributes[time]);
            }

            this.populateTime(time);
            $('#add').toggleClass('selected');
            $('#addActivityPopup').toggle();
        },

        clearActivity: function(){
            //TODO: clear todays meal
            var time = $(".time.selected").attr('data-name') || "morning";
            this.item.clearMeal(time);
            $('#add').toggleClass('selected');
            $('#addActivityPopup').toggle();
            this.populateTime(time);
        },

        showNutrition: function(){
            var self=this;
            if($('#nutritionSection').is(':visible')){
                $("#nutritionSection").hide();
                $("#activityInputs").show();
            } else {
                $("#nutritionSection").show();
                $("#activityInputs").hide();
                self.populateNutrition(self.item, self.time, $("#nutritionSection"), 0);
            }
        },

        updateNutrition: function(el){
            // el = el || $("#nutritionSection .boxEntry");

            // for(var i=0; i<el.length; i++){
            //     var thisEl = $(el[i]);
            //     var percent = thisEl.find("#rda").text() || "0%";
            //     thisEl.find("#name").css("background-size", percent +" 100%");
            // }

        },

        populateNutrition: function(model, meal, el, index){
            // model = model.attributes;
            // el =  el || $("#nutritionSection");
            // index = index || 0;
            // meal = model[meal][index];

            // el.find("#totalCalories #amount").text(Math.round(meal.calories));
            // el.find("#fat #amount").text(Math.round(meal.fat));
            // el.find("#cholesterol #amount").text(Math.round(meal.cholesterol));
            // el.find("#sodium #amount").text(Math.round(meal.sodium));
            // el.find("#carbohydrates #amount").text(Math.round(meal.carbohydrates));
            // el.find("#dietryFibre #amount").text(Math.round(meal.fibre));
            // el.find("#protein #amount").text(Math.round(meal.protein));

            // //rda's
            // el.find("#totalCalories #rda").text(Math.round((meal.calories/collection.dailyValues.calories)*100) + "%");
            // el.find("#fat #rda").text(Math.round((meal.fat/collection.dailyValues.fat)*100) + "%");
            // el.find("#cholesterol #rda").text(Math.round((meal.cholesterol/collection.dailyValues.cholesterol)*100) + "%");
            // el.find("#sodium #rda").text(Math.round((meal.sodium/collection.dailyValues.sodium)*100) + "%");
            // el.find("#carbohydrates #rda").text(Math.round((meal.carbohydrates/collection.dailyValues.carbohydrates)*100) + "%");
            // el.find("#dietryFibre #rda").text(Math.round((meal.fibre/collection.dailyValues.fibre)*100) + "%");
            // el.find("#protein #rda").text(Math.round((meal.protein/collection.dailyValues.protein)*100) + "%");
            // this.updateNutrition();
        },

        showActivityItem: function(e){
            var target = $(e.currentTarget);
            var id = target.attr("data-id");
            var item = this.item;
            var time = $(".time.selected").attr('data-name') || "morning";
            var self = this;
            if(item){
                var activities = item.attributes[time];

                // loop starts at 1 as first entry is meal details (calories, notes, etc.)
                for(var i=1;i<activities.length;i++){
                    var index = activities[i];
                    if(index.id === id){
                        var servings = index.serving.split(" x ")[0];
                        var size = index.serving.split(" x ")[1];

                        this.activityItem = activities[i];
                        this.$('#activityContainer').hide();
                        this.$('#nutritionSection').hide();
                        this.$("#rightContent").append(self.activityItemTpl({item:index, imgSrc:""}));
                        $("#size").val(size).attr('disabled','disabled');
                        $("#serving").val(parseInt(servings,10));
                        self.populateNutrition(item, meal, $('#nutritionInfo'), i);
                        $("#activityItemScreen").attr("data-id", id);
                    }
                }
            }
            this.updateNutrition($('#nutritionInfo .boxEntry'));
        },

        closeActivityItem: function(){
            this.$('#activityContainer').show();
            this.$('#activityItemScreen').remove();
        },

        editActivityItem: function(){
            var self = this;
            var time = $(".time.selected").attr('data-name') || "morning";
            var timeArr = this.item.attributes[time];
            var newServing = parseInt($("#serving").val(),10);
            var oldServing = parseInt(self.activityItem.serving.split(" x ")[0],10);
            var size       = self.activityItem.serving.split(" x ")[1];

            for(var i=1;i<timeArr.length;i++){
                if(timeArr[i].id == self.activityItem.id){
                    var item = timeArr[i];
                    item.serving = newServing + " x " + size;
                    item = self.multiplyNutrition(newServing, item, oldServing);
                    self.item.set(time, timeArr);
                    self.$('#activityContainer').show();
                    self.$('#activityItemScreen').remove();
                    self.populateTime(time);
                }
            }
        },

        multiplyNutrition: function(serving, model, oldServing){
            // var att = model;
            // var calories      = parseFloat(att.calories) || 0;
            // var fat           = parseFloat(att.total_fat) || 0;
            // var cholesterol   = parseFloat(att.cholesterol) || 0;
            // var sodium        = parseFloat(att.sodium) || 0;
            // var carbohydrates = parseFloat(att.total_carbohydrates) || 0;
            // var fibre         = parseFloat(att.fiber) || 0;
            // var protein       = parseFloat(att.protein) || 0;

            // att.calories      = (calories/oldServing)*serving;
            // att.fat           = (fat/oldServing)*serving;
            // att.cholesterol   = (cholesterol/oldServing)*serving;
            // att.sodium        = (sodium/oldServing)*serving;
            // att.carbohydrates = (carbohydrates/oldServing)*serving;
            // att.fibre         = (fibre/oldServing)*serving;
            // att.protein       = (protein/oldServing)*serving;

            // model.attributes = att;
            // return model;
        },

        deleteActivityItem: function(){
            console.log(this.activityItem);
            var self = this;
            var time = $(".time.selected").attr('data-name') || "morning";
            var timeArr = this.item.attributes[time];

            for(var i=1;i<timeArr.length;i++){
                if(timeArr[i].id == self.foodItem.id){
                    timeArr.splice(i,1);
                    self.item.set(time, timeArr);
                    self.$('#activityContainer').show();
                    self.$('#activityItemScreen').remove();
                    self.populateTime(time);
                }
            }
        }


    });
});