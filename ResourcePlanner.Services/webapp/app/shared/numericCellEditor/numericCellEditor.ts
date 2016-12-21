//import { Component, OnDestroy, OnInit } from '@angular/core';

//import { CONFIG, MessageService } from '../../core';
//import { ResourceService, OptionService, UpdateAssignment, TimeAggregation } from '../../models';

//@Component({
//    moduleId: module.id,
//    selector: 'numeric-cell-editor',
//    templateUrl: 'numericCellEditor.component.html',
//    styleUrls: ['numericCellEditor.component.css'],
//    inputs: ['assignmentInfo']
//})
//export class numericCellEditorComponent implements OnDestroy, OnInit {

//    // gets called once before the renderer is used
//    init(params) {
//        // create the cell
//        this.eInput = document.createElement('input');

//        if (isCharNumeric(params.charPress)) {
//            this.eInput.value = params.charPress;
//        } else {
//            if (params.value !== undefined && params.value !== null) {
//                this.eInput.value = params.value;
//            }
//        }

//        var that = this;
//        this.eInput.addEventListener('keypress', function (event) {
//            if (!isKeyPressedNumeric(event)) {
//                that.eInput.focus();
//                if (event.preventDefault) event.preventDefault();
//            }
//        });

//        // only start edit if key pressed is a number, not a letter
//        var charPressIsNotANumber = params.charPress && ('1234567890'.indexOf(params.charPress) < 0);
//        this.cancelBeforeStart = charPressIsNotANumber;
//    };

//    // gets called once when grid ready to insert the element
//    getGui() {
//        return this.eInput;
//    };

//    // focus and select can be done after the gui is attached
//    afterGuiAttached() {
//        this.eInput.focus();
//    };

//    // returns the new value after editing
//   isCancelBeforeStart() {
//        return this.cancelBeforeStart;
//    };

//    // example - will reject the number if it contains the value 007
//    // - not very practical, but demonstrates the method.
//    isCancelAfterEnd() {
//        var value = this.getValue();
//        return value.indexOf('007') >= 0;
//    };

//    // returns the new value after editing
//    getValue = function () {
//        return this.eInput.value;
//    };

//    // any cleanup we need to be done here
//    destroy = function () {
//        // but this example is simple, no cleanup, we could  even leave this method out as it's optional
//    };

//    // if true, then this editor will appear in a popup 
//   isPopup = function () {
//        // and we could leave this method out also, false is the default
//        return false;
//    };

//}