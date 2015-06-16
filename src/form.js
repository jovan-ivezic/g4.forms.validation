;(function() {

    var FormAbstract = function() {};

    FormAbstract.prototype = {

        hasErrors:false,

        attachEvents: function()
        {
            $('body').on('submit', this.formSelector, $.proxy(this.onSubmit, this));
            return this;
        },

        detachEvents: function()
        {
            $('body').off('submit', this.formSelector, $.proxy(this.onSubmit, this));
            return this;
        },

        executeOneRule: function(oneField, key, meta)
        {
            if (meta.validationRule.call(this.validatorInstace, oneField.value)) {
                this.hasErrors = true;
                this.errorInstace.addError(this.getFieldByName(oneField.name), meta.message);
            }
        },

        filterOneField: function(oneField)
        {
            if (this.fields[oneField.name] !== undefined) {
                this.filterInstace.trim(this.getFieldByName(oneField.name));
            }
        },

        getFieldByName: function(name)
        {
            return $('[name="'+name+'"]', this.formSelector);
        },

        getFormFields: function()
        {
            var searializedObj = $(this.formSelector).serializeArray();
            $("input:checkbox", $(this.formSelector)).each(function(){
                searializedObj.push({
                    name:this.name,
                    value: this.checked
                });
            });
            return searializedObj;
        },

        init: function()
        {
            this.detachEvents().attachEvents();
        },

        onSubmit: function(event)
        {
            event.preventDefault();
            this.validateFields();
            if(!this.hasErrors){
                try {
                    if(this.clearEventListeners != undefined &&
                        this.clearEventListeners == true){
                        this.detachEvents();
                    }
                    this.submit();
                } catch(err) {
                    console.log('ERROR ' + err);
                }
            }
        },

        submitStart: function()
        {
            $(".js_loader").removeClass("hidden");
            $("input[type=submit]",this.formSelector).hide();
        },

        submitEnd: function()
        {
            $(".js_loader").addClass("hidden");
            $("input[type=submit]",this.formSelector).show();
        },

        validateFields: function()
        {
            this.hasErrors = false;
            $.each(this.getFormFields(), $.proxy(this.validateOneField, this));
        },

        validateOneField: function(key, oneField)
        {
            if(this.fields == undefined){
                throw "Fields is required";
            }

            if (this.fields[oneField.name] !== undefined) {
                this.errorInstace.removeError(this.getFieldByName(oneField.name));
                this.filterOneField(oneField);
                $.each(this.fields[oneField.name], $.proxy(this.executeOneRule, this, oneField));
            }
        }

    };


    if (typeof define != 'undefined' && define.hasOwnProperty('amd') && define.amd) { // RequireJS AMD
        define(["./filter", "./validator", "./error"], function(filter, validator, error){
            FormAbstract.prototype.filterInstace = new filter();
            FormAbstract.prototype.errorInstace = new error();
            FormAbstract.prototype.validatorInstace = new validator();
            return FormAbstract;
        });
    } else if (typeof window != 'undefined') { // Fall back to attaching to window
        window.G4 = typeof G4 != "undefined" ? G4 : {};
        window.G4.form = typeof G4.form != "undefined" ? G4.form : {};
        FormAbstract.prototype.filterInstace = new G4.form.filter();
        FormAbstract.prototype.errorInstace = new G4.form.error();
        FormAbstract.prototype.validatorInstace = new G4.form.validator();
        window.G4.form = FormAbstract;
    };

}.call(this));