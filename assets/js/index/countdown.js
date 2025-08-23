"use strict";
console.log("countdown.js loaded");

var Countdown = {
  // Params
  countdown_interval: null,
  target_date: null,
  $el: null,

  // Initialize the countdown
  init: function () {
    // Find the countdown element
    this.$el = document.querySelector(".countdown");

    if (!this.$el) {
      console.error("Không tìm thấy element .countdown");
      return;
    }

    // DOM elements
    this.$ = {
      days: this.$el.querySelectorAll(".bloc-time.days .figure"),
      hours: this.$el.querySelectorAll(".bloc-time.hours .figure"),
      minutes: this.$el.querySelectorAll(".bloc-time.min .figure"),
      seconds: this.$el.querySelectorAll(".bloc-time.sec .figure"),
    };

    // Get target date from data attribute
    var targetDateString = this.$el.getAttribute("data-time-count");
    if (!targetDateString) {
      console.error("Vui lòng set ngày đích trong data-time-count");
      return;
    }

    this.target_date = new Date(targetDateString);

    if (isNaN(this.target_date.getTime())) {
      console.error("Format ngày không hợp lệ trong data-time-count");
      return;
    }

    console.log("Target date:", this.target_date.toLocaleString());

    // Start countdown
    this.count();
  },

  count: function () {
    var that = this,
      $day_1 = this.$.days[0],
      $day_2 = this.$.days[1],
      $hour_1 = this.$.hours[0],
      $hour_2 = this.$.hours[1],
      $min_1 = this.$.minutes[0],
      $min_2 = this.$.minutes[1],
      $sec_1 = this.$.seconds[0],
      $sec_2 = this.$.seconds[1];

    // Initial update
    this.updateTime();

    this.countdown_interval = setInterval(function () {
      that.updateTime();
    }, 1000);
  },

  updateTime: function () {
    var now = new Date();
    var timeDifference = this.target_date - now;

    if (timeDifference <= 0) {
      // Time's up!
      clearInterval(this.countdown_interval);
      console.log("Countdown finished!");

      // Set all to 00
      this.setFigureValue(this.$.days[0], "0");
      this.setFigureValue(this.$.days[1], "0");
      this.setFigureValue(this.$.hours[0], "0");
      this.setFigureValue(this.$.hours[1], "0");
      this.setFigureValue(this.$.minutes[0], "0");
      this.setFigureValue(this.$.minutes[1], "0");
      this.setFigureValue(this.$.seconds[0], "0");
      this.setFigureValue(this.$.seconds[1], "0");
      return;
    }

    // Calculate time units
    var days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    var hours = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    var minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    // Update DOM values with animation
    this.checkHour(days, this.$.days[0], this.$.days[1]);
    this.checkHour(hours, this.$.hours[0], this.$.hours[1]);
    this.checkHour(minutes, this.$.minutes[0], this.$.minutes[1]);
    this.checkHour(seconds, this.$.seconds[0], this.$.seconds[1]);
  },

  setFigureValue: function ($el, value) {
    var $top = $el.querySelector(".top");
    var $bottom = $el.querySelector(".bottom");
    $top.innerHTML = value;
    $bottom.innerHTML = value;
  },

  animateFigure: function ($el, value) {
    var $top = $el.querySelector(".top");
    var $bottom = $el.querySelector(".bottom");
    var $back_top = $el.querySelector(".top-back span");
    var $back_bottom = $el.querySelector(".bottom-back span");

    // Before we begin, change the back value
    $back_top.innerHTML = value;
    $back_bottom.innerHTML = value;

    // Then animate with CSS transitions
    $top.style.transform = "rotateX(-180deg)";

    setTimeout(function () {
      $top.innerHTML = value;
      $bottom.innerHTML = value;
      $top.style.transform = "rotateX(0deg)";
    }, 300);
  },

  checkHour: function (value, $el_1, $el_2) {
    var val_1 = value.toString().padStart(2, "0").charAt(0);
    var val_2 = value.toString().padStart(2, "0").charAt(1);
    var fig_1_value = $el_1.querySelector(".top").innerHTML;
    var fig_2_value = $el_2.querySelector(".top").innerHTML;

    if (fig_1_value !== val_1) {
      this.animateFigure($el_1, val_1);
    }
    if (fig_2_value !== val_2) {
      this.animateFigure($el_2, val_2);
    }
  },
};

// Wait for DOM to be ready
document.addEventListener("DOMContentLoaded", function () {
  Countdown.init();
});

// Fallback if DOMContentLoaded already fired
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", function () {
    Countdown.init();
  });
} else {
  Countdown.init();
}
