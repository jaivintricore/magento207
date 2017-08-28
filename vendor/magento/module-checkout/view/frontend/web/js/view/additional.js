
define(
    [
        'jquery',
        'ko',
        'uiComponent',
        'Magento_Checkout/js/model/quote',
        'HS_OneStepCheckout/js/action/set-additional-information',
        'mage/calendar'
    ],
    function ($, ko, Component, quote, setAdditionalInformationAction, calendar) {
        'use strict';

        var isLoading = ko.observable(false);
        var hsOscComment = ko.observable(null);
        var hsOscDeliveryDate = ko.observable(null);
        var hsOscSurvey = ko.observable(null);
        var hsSurveyOtherAnswer = ko.observable(null);
        var hsOscGiftwrap = ko.observable((quote.getTotals().hs_osc_giftwrap_amount) ? true : false);
        var canShowSurveyOther = ko.observable(false);

        return Component.extend({
            defaults: {
                template: 'HS_OneStepCheckout/additional'
            },

            /**
             * Applied flag
             */
            isLoading: isLoading,
            canShowAdditionalInformation: window.checkoutConfig.isEnabledAdditionalInformation,
            canShowComment: window.checkoutConfig.isEnabledOrderComment,
            canShowDeliveryDate: window.checkoutConfig.isEnabledDeliveryDate,
            canShowGiftwrap: window.checkoutConfig.isEnabledGiftwrap,
            giftwrapFee: window.checkoutConfig.giftWrapFee,
            giftwrapFeeFormatted: window.checkoutConfig.giftwrapFeeFormatted,
            canShowSurvey: window.checkoutConfig.isEnabledSurvey,
            surveyQuestion: window.checkoutConfig.surveyQuestion,
            surveyOptions: window.checkoutConfig.surveyOptions,
            hsOscComment: hsOscComment,
            hsOscDeliveryDate: hsOscDeliveryDate,
            hsOscSurvey: hsOscSurvey,
            hsSurveyOtherAnswer: hsSurveyOtherAnswer,
            hsOscGiftwrap: hsOscGiftwrap,
            canShowSurveyOther: canShowSurveyOther,

            /**
             * Init component
             */
            initialize: function () {
                this._super();
                if(this.canShowDeliveryDate) {
                    $("#hs-osc-delivery-date").calendar({
                        showsTime: false,
                        dateFormat: "M/d/yy",
                        buttonImage: "http://localhost/magento2-dev/HS_OneStepCheckout/pub/static/frontend/Magento/luma/en_US/Magento_Theme/calendar.png",
                        buttonText: "Select Date"
                    })
                }
            },

            /**
             * Coupon form validation
             *
             * @returns {boolean}
             */
            validate: function() {
                var form = '#discount-form';
                return $(form).validation() && $(form).validation('isValid');
            },

            submitAdditional: function(data, event) {
                var loading = true;
                if(event.target.id == 'hs-osc-survey' && event.target.value == 'Other') {
                    loading = false;
                }
                isLoading(loading);
                var surveyAnswer = hsOscSurvey();
                if(surveyAnswer == 'Other') {
                    canShowSurveyOther(true);
                    surveyAnswer = hsSurveyOtherAnswer();
                } else {
                    canShowSurveyOther(false);
                    hsSurveyOtherAnswer(null);
                }
                var data = {
                    additionalInformation: {
                        hs_osc_comment: hsOscComment(),
                        hs_osc_delivery_date: hsOscDeliveryDate(),
                        hs_osc_survey_question: this.surveyQuestion,
                        hs_osc_survey_answer: (surveyAnswer) ? surveyAnswer : null,
                        hs_osc_giftwrap: hsOscGiftwrap()
                    }
                };
                setAdditionalInformationAction(data, isLoading);
            }
        });
    }
);
