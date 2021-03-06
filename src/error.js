;(function() {

    var error = function(){};

    error.prototype = {

        addError: function(field, message)
        {
            $(field).parent().find('.js_form_error').remove();
            $(field).parent().addClass('js_has_error').addClass('has_error');
            $(field).before('<span class="js_form_error error_message">'+message+'</span>' );
        },

        removeErrorMsg: function(event)
        {
            $(event.currentTarget).remove();
        },

        removeParrentErrorMsg: function(event)
        {
            $(event.currentTarget).parent().find('.js_form_error').remove();
        },

        removeError: function(field)
        {
            field.parent().find('.js_form_error').remove();
            field.parent().removeClass('js_has_error').removeClass('has_error');
        },

        onClickRemoveErrors: function(scope)
        {
            $('body').off('click',scope.formSelector + ' .js_form_error').on('click',scope.formSelector + ' .js_form_error', $.proxy(this.removeErrorMsg, this));
            $('body').off('focus',scope.formSelector + ' input').on('click', scope.formSelector + ' input', $.proxy(this.removeParrentErrorMsg, this));
        }

    };

    if (typeof define != 'undefined' && define.hasOwnProperty('amd') && define.amd) { // RequireJS AMD
        define(function(){
            return error;
        });
    } else if (typeof window != 'undefined') { // Fall back to attaching to window
        window.G4 = typeof G4 != "undefined" ? G4 : {};
        window.G4.form = typeof G4.form != "undefined" ? G4.form : {};
        window.G4.form.error =  error;
    };

}).call(this);