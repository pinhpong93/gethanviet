/*
 * JavaScript functions for dirty check
 * @author luongdolong
 *
 */
var dirtyCheckThrough = false;
var arrayInputVar = new Array();
var arrayOmitItems = new Array();
var arrayOmitForms = new Array();
var arrayOmitActions = new Array();

var omitInput = '';
var omitForm = '';

if (window.addEventListener){
  window.addEventListener('load', getInputVars, false);
} else if (window.attachEvent){
  window.attachEvent('onload', getInputVars);
}

/**
 * set action submit for ignore check
 *
 * @author luongdolong
 * @param action: name of action ignore check
 *
 */
function setOmitAction(action){

  var omitAction = action;
  if(omitAction != ''){
    arrayOmitActions = omitAction.split(';');
    for(e = 0; e < arrayOmitActions.length; e++){
      var el = document.getElementById(arrayOmitActions[e]);
      if(el == null){
        continue;
      }
      if (window.addEventListener){
        el.addEventListener('click', disableCheckChange, false);
      } else if (window.attachEvent){
        el.attachEvent('onclick', disableCheckChange);
      }
    }
  }
}

/**
 * get input value at form load
 *
 * @author luongdolong
 * @return none
 */
function getInputVars(){
    var oForm;
    for (idx = 0; document.forms[idx]; idx++) {
        oForm = document.forms[idx];
        arrayInputVar[idx] = $(document.getElementById(oForm.id)).serialize();
    }
    //dirtyCheckInputVars = $("form").serialize();
}

/**
 * compare between old value and new value in multiple form
 *
 * @author luongdolong
 * @return true: if not change; false: otherwise
 */
function checkChange(){
    var currentVars = new Array();
    var form;
    var ret = true;
    var oldValue;
    var newValue;

    arrayOmitItems = omitInput.split(';');
    arrayOmitForms = omitForm.split(';');

    for (index = 0; index < document.forms.length; index++) {

      currentVars[index] = $(document.getElementById(document.forms[index].id)).serialize();

        if(existOmitForm(document.forms[index].id) == true){
            continue;
        }
        tmp1 = arrayInputVar[index];
        oldValue = cutElement(tmp1);
        tmp2 = currentVars[index];
        newValue = cutElement(tmp2);

        if(compareInputVar(oldValue, newValue) == false){
            ret = false;
            break;
        }
    }
    return ret;
}

/**
 * cut element that don't need check
 *
 * @author luongdolong
 * @param strVal: string for cut element don't check
 * @return string after cut element don't check
 */
function cutElement(strVal){
    if(strVal == null || strVal == ''){
        return '';
    }
    var strRet = '';
    var start;
    var end;
    strRet = strVal;

    for(i = 0; i < arrayOmitItems.length; i++){
      if(arrayOmitItems[i] == '' || arrayOmitItems[i] == null){
        continue;
      }
        if(strRet.indexOf(arrayOmitItems[i]) == 0){
            end = strRet.indexOf('&') + 1;
            if(end > 0){
                strRet = strRet.replace(strRet.slice(0, end), '');
            }else{
                strRet = strRet.replace(strRet.slice(0), '');
            }
        }
        while(strRet.indexOf(arrayOmitItems[i]) > 0 ){
            start = strRet.indexOf(arrayOmitItems[i]);
            end = strRet.indexOf('&', start) + 1;
            if(end > 0){
                strRet = strRet.replace(strRet.slice(start, end), '');
            }else{
                strRet = strRet.replace(strRet.slice(start), '');
            }

        }
    }
    return strRet;
}

/**
 * check exist a form id in array form
 *
 * @author luongdolong
 * @param idForm: id form
 * @return true: if exist; false: otherwise
 */
function existOmitForm(idForm){
    if(arrayOmitForms == null || arrayOmitForms.length == 0){
        return false;
    }
    for(j = 0; j < arrayOmitForms.length; j++){
        if(idForm == arrayOmitForms[j]){
            return true;
        }
    }
    return false;
}

/**
 * compare between old value and new value in a form
 *
 * @author luongdolong
 * @param oldVal
 * @param newVal
 * @return false: if difference; true: otherwise
 */
function compareInputVar(oldVal, newVal){
    if(oldVal == '' || newVal == ''){
        return true;
    }
    var arrayOld = oldVal.split('&');
    var arrayNew = newVal.split('&');
    if(arrayNew.length < arrayOld.length){
        return false;
    }
    for(o = 0; o < arrayOld.length; o++){
        if(arrayOld[o] != arrayNew[o]){
            return false;
        }
    }
    return true;
}
var ignoreChange = false;
/**
 * attack event unload to call check change
 *
 * @author luongdolong
 */
window.onbeforeunload = function(event) {
    if(ignoreChange == true){
        ignoreChange = false;
        return;
    }
    event = event || window.event;
    if(checkChange() == false){
        event.returnValue = "その他ページに移動しようとしています。入力されたデータを廃止してもよろしいですか。";
    }
}

/**
 * Turn on check change when popup sentence window is called
 *
 * @author hungnv
 */
function initIgnoreChangeValue() {
  ignoreChange = false;
}
/**
 * Turn off check change when call an action
 *
 * @author luongdolong
 * @return none
 */
function disableCheckChange(){
    ignoreChange = true;
}

/**
 * Processing dirty check for controls of taglib AJAX A4J
 *
 * @author luongdolong
 * @return Boolean
 */
function dirtyCheckA4J(flagOpenPopup){
  var message = '';
    message = 'このページからほかのページに移動しますか？\r\n\r\n';
    message += '入力内容が変更されています\r\n\r\n';
    message += '続行するには[OK]をクリックし、現在のページから移動しない場合は[キャンセル]をクリックしてください。 ';

    disableCheckChange();
    if(checkChange() == false){
        var cfm = confirm(message);
        if (!cfm || (typeof flagOpenPopup != "undefined" && flagOpenPopup == 1)) {
            ignoreChange = false;
        }
        return !cfm;
    }
    return false;
}
