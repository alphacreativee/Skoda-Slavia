"use strict";

var Countdown = {
  $el: null,
  countdown_interval: null,
  target_date: null,

  init: function () {
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

    // Initialize display with current values
    this.updateTime();

    // Start countdown
    this.count();
  },

  count: function () {
    var that = this;

    this.countdown_interval = setInterval(function () {
      that.updateTime();
    }, 1000);
  },

  updateTime: function () {
    var now = new Date();
    var timeDifference = this.target_date - now;

    if (timeDifference <= 0) {
      clearInterval(this.countdown_interval);
      console.log("Countdown finished!");
      return;
    }

    // Calculate time units
    var days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    var hours = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    var minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    // Update display with flip animation
    this.checkHour(days, this.$.days[0], this.$.days[1]);
    this.checkHour(hours, this.$.hours[0], this.$.hours[1]);
    this.checkHour(minutes, this.$.minutes[0], this.$.minutes[1]);
    this.checkHour(seconds, this.$.seconds[0], this.$.seconds[1]);
  },

  animateFigure: function ($el, value) {
    var $top = $el.querySelector(".top");
    var $bottom = $el.querySelector(".bottom");
    var $back_top = $el.querySelector(".top-back");
    var $back_bottom = $el.querySelector(".bottom-back");

    // Before we begin, change the back value
    $back_top.querySelector("span").innerHTML = value;
    $back_bottom.querySelector("span").innerHTML = value;

    // Animate top flipping down
    $top.style.transform = "perspective(200px) rotateX(-180deg)";

    // Animate back-top flipping to horizontal
    $back_top.style.transform = "perspective(200px) rotateX(0deg)";

    // After animation completes
    setTimeout(function () {
      // Update front values
      $top.innerHTML = value;
      $bottom.innerHTML = value;

      // Reset positions instantly
      $top.style.transition = "none";
      $back_top.style.transition = "none";

      $top.style.transform = "perspective(200px) rotateX(0deg)";
      $back_top.style.transform = "perspective(200px) rotateX(180deg)";

      // Re-enable transitions after a short delay
      setTimeout(function () {
        $top.style.transition = "transform 0.8s ease-out";
        $back_top.style.transition = "transform 0.8s ease-out";
      }, 50);
    }, 800);
  },

  checkHour: function (value, $el_1, $el_2) {
    var paddedValue = value.toString().padStart(2, "0");
    var val_1 = paddedValue.charAt(0);
    var val_2 = paddedValue.charAt(1);
    var fig_1_value = $el_1.querySelector(".top").innerHTML;
    var fig_2_value = $el_2.querySelector(".top").innerHTML;

    // Animate only if the figure has changed
    if (fig_1_value !== val_1) {
      this.animateFigure($el_1, val_1);
    }
    if (fig_2_value !== val_2) {
      this.animateFigure($el_2, val_2);
    }
  },
};

// Wait for DOM to be ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", function () {
    Countdown.init();
  });
} else {
  Countdown.init();
}
