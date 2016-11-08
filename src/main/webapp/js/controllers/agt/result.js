app.filter('formatDuration', function() {
    return function(intDuration, language) {
    	var textReturn="";
        var duration = intDuration;
        var hour = Math.floor(duration / 60);
        var min = duration % 60;
		
        if (language == "en") {
        	if(hour>= 1) {
        		if(min == 0) {
        			textReturn = hour + "h";
        		} else {
        			textReturn = hour + "h" + min + "m";
        		}
        	} else {
        		textReturn = min + "m";
        	}
        	
        } else {
        	if(hour>= 1) {
        		if(min == 0) {
        			textReturn = hour + "時間";
        		} else {
        			textReturn = hour + "時間" + min + "分";
        		}
        	} else {
        		textReturn = min + "分";
        	}
        }
        
        return textReturn;
    }

});

app.filter('formatDate', function() {
    return function(strDate, language){
    	var strReturn = formatDate(strDate, language);
    	return strReturn;
    }

});


function formatDate(strDate, language) {
	var strDateReturn = "";
	var inputDate = strDate;
	//format date
	var year = inputDate.substring(6, 10);
	var month = inputDate.substring(3, 5) - 1;
	var day = inputDate.substring(0, 2);
	var hourmin = inputDate.substring(11, 16);
	var date = new Date(Date.UTC(year, month, day));

	if (language == "en") {
		var optionsEn = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
		optionsEn.timeZone = 'UTC';
		strDateReturn = date.toLocaleDateString('en-US', optionsEn) + " " + hourmin;
	} else {
		var optionsJp = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' };
		optionsJp.timeZone = 'UTC';
		strDateReturn = date.toLocaleDateString('ja-JP', optionsJp) + " " + hourmin;
	}
    return strDateReturn;
}

app.filter('filterNameAir', function() {
	return function(code, mapNameAir, name, language) {
		var codeAirport = code;
		var strReturn = "";
		for ( var j = 0; j < mapNameAir.length; j++) {
			if (codeAirport == mapNameAir[j].codeAirport) {
				if (language == "en") {
					strReturn = mapNameAir[j].nameAirportEn;
				} else {
					strReturn = mapNameAir[j].nameAirportJp;
				}
			}
			
			if(strReturn == "") {
				strReturn = name;
			}
		}
		
	    return strReturn;
	}
});


app.filter('filterNameSupplier', function() {
	return function(code, mapNameSupplier, name, language) {
		var strCode = code;
		var strReturn = "";
		for ( var j = 0; j < mapNameSupplier.length; j++) {
			if (strCode == mapNameSupplier[j].codeSupplier) {
				if (language == "en") {
					strReturn = mapNameSupplier[j].nameSupplierEn;
				} else {
					strReturn = mapNameSupplier[j].nameSupplierJp;
				}
			}
			
			if(strReturn == "") {
				strReturn = name;
			}
		}
		
	    return strReturn;
	}
});

app.filter('filterCurrency', function() {
	return function(code, mapCurrency, language) {
		var strCode = code;
		var strReturn = "";
		for ( var j = 0; j < mapCurrency.length; j++) {
			if (strCode == mapCurrency[j].codeCurrency) {
				if (language == "en") {
					strReturn = mapCurrency[j].CurrencyNameEn;
				} else {
					strReturn = mapCurrency[j].CurrencyNameJp;
				}
			}
			
			if(strReturn == "") {
				strReturn = code;
			}
		}
		
	    return strReturn;
	}
});



app.controller('listdata', function($scope, $http, $timeout, $window) {
	
	//hide progressBar
	$("#progressbar").addClass("ng-hide").removeClass("ng-show");
	$("#divcontent").addClass("ng-show").removeClass("ng-hide");
	
	$scope.mapNameAir = [];
	$scope.mapCityAir = [];
	$scope.mapCurrency = [];
	$scope.mapNameSupplier = [];
	$scope.nameOrigin = "";
	$scope.nameDestination = "";
	$scope.oMessApiErr = "";
	$scope.rMessApiErr = "";

	var depart = "";
	var arrive = "";
	if (language == "en") {
		depart = "Depart";
		arrive = "Arrive";
	} else {
		depart = "出発";
		arrive = "到着";
	}
	
	
	$timeout(function(){
		//alert($scope.numOut);
		if ($scope.language != "") {
			lang = $scope.language;
		} 
		mapCityAir = "../mockJson/mapCityAir_" + lang + ".json";
		mapNameSupplier = "../mockJson/mapNameSupplier.json";
		mapPriceDetail = "../mockJson/mapPriceDetail.json";
		mapCurrency = "../mockJson/mapCurrency.json"
		// get data name and code of currency
		$http.get(mapPriceDetail).success(function(response1){ 
			$scope.mapPriceDetail = response1;
		});
		$http.get(mapCurrency).success(function(response2){ 
			$scope.mapCurrency = response2;
		});
		
		$http.get(mapCityAir).success(function(responseCityAir){ 
			$scope.mapCityAir = responseCityAir;
			var nameO = "";
			var nameD = "";
			var indexP2=0;
			var indexP2=0;
			for ( var j = 0; j < $scope.mapCityAir.length; j++) {
				if ($scope.codeOrigin == $scope.mapCityAir[j].codeCityAir) {
					nameO = $scope.mapCityAir[j].nameCityAir;
					if(lang == "en") {
						indexP1 = nameO.indexOf(" (");
						$scope.nameOrigin = nameO.substring(0, indexP1)
					} else {
						indexP1 = nameO.indexOf(", ");
						$scope.nameOrigin = nameO.substring(0, indexP1)
					}
					
				}
				
				if ($scope.codeDestination == $scope.mapCityAir[j].codeCityAir) {
					nameD = $scope.mapCityAir[j].nameCityAir;
					if(lang == "en") {
						indexP2 = nameD.indexOf(" (");
						$scope.nameDestination = nameD.substring(0, indexP2)
					} else {
						indexP2 = nameD.indexOf(", ");
						$scope.nameDestination = nameD.substring(0, indexP2)
					}
				}
			}
		});
		
		$http.get("../mockJson/mapNameAir.json").success(function(response){ 
		$scope.mapNameAir = response;
		$http.get(mapNameSupplier).success(function(responseNameSupplier){ 
				$scope.mapNameSupplier = responseNameSupplier;
			
		if ($scope.OutWards !=null && $scope.OutWards.length > 0) {
			
			for (var i = 0; i < $scope.OutWards.length; i++) {
//				for ( var j = 0; j < $scope.mapNameAir.length; j++) {
//					if ($scope.OutWards[i].codeDestination == $scope.mapNameAir[j].codeAirport) {
//						if (language == "en") {
//							$scope.OutWards[i].nameDestination = $scope.mapNameAir[j].nameAirportEn;
//							$scope.OutWards[i].cityDestination = $scope.mapNameAir[j].nameCityEn;
//						} else {
//							$scope.OutWards[i].nameDestination = $scope.mapNameAir[j].nameAirportJp;
//							$scope.OutWards[i].cityDestination = $scope.mapNameAir[j].nameCityJp;
//						}
//					}
//					if ($scope.OutWards[i].codeOrigin == $scope.mapNameAir[j].codeAirport) {
//						if (language == "en") {
//							$scope.OutWards[i].nameOrigin = $scope.mapNameAir[j].nameAirportEn;
//							$scope.OutWards[i].cityOrigin  = $scope.mapNameAir[j].nameCityEn;
//						} else {
//							$scope.OutWards[i].nameOrigin = $scope.mapNameAir[j].nameAirportJp;
//							$scope.OutWards[i].cityOrigin = $scope.mapNameAir[j].nameCityJp;
//						}
//					}
//					
//				}
//				
//				for ( var k = 0; k < $scope.mapCurrency.length; k++) {
//					if ($scope.OutWards[i].currency == $scope.mapCurrency[k].codeCurrency) {
//						if (language == "en") {
//							$scope.OutWards[i].currency = $scope.mapCurrency[k].CurrencyNameEn;
//						} else {
//							$scope.OutWards[i].currency = $scope.mapCurrency[k].CurrencyNameJp;
//						}
//					}
//				}
//				
//				//alert($scope.OutWards[i].codeSupplier);
//				for ( var j = 0; j < $scope.mapNameSupplier.length; j++) {
//					if ($scope.OutWards[i].codeSupplier == $scope.mapNameSupplier[j].codeSupplier) {
//						if (language == "en") {
//							$scope.OutWards[i].vendingOperatorAir = $scope.mapNameSupplier[j].nameSupplierEn;
//						} else {
//							$scope.OutWards[i].vendingOperatorAir = $scope.mapNameSupplier[j].nameSupplierJp;
//						}
//						
//					}
//				}
				
				
				$scope.OutWards[i].detail = getdetailsOutWard($scope.OutWards[i].lstSegmentDetail);

//				//format date
//				var yearDepart = $scope.OutWards[i].departDate.substring(6, 10);
//				var monthDepart = $scope.OutWards[i].departDate.substring(3, 5) - 1;
//				var dayDepart = $scope.OutWards[i].departDate.substring(0, 2);
//				var hourminDepart = $scope.OutWards[i].departDate.substring(11, 16);
//				var dateDepart = new Date(Date.UTC(yearDepart, monthDepart, dayDepart));	
//				
//				var yearArrive = $scope.OutWards[i].arriveDate.substring(6, 10);
//				var monthArrive = $scope.OutWards[i].arriveDate.substring(3, 5) - 1;
//				var dayArrive = $scope.OutWards[i].arriveDate.substring(0, 2);
//				var hourminArrive = $scope.OutWards[i].arriveDate.substring(11, 16);
//				var dateArrive = new Date(Date.UTC(yearArrive, monthArrive, dayArrive));
//	
//				if ($scope.language == "en") {
//					var optionsEn = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
//					optionsEn.timeZone = 'UTC';
//					$scope.OutWards[i].arriveDate = dateArrive.toLocaleDateString('en-US', optionsEn) + " " + hourminArrive;
//					$scope.OutWards[i].departDate = dateDepart.toLocaleDateString('en-US', optionsEn) + " " + hourminDepart;
//				} else {
//					var optionsJp = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' };
//					optionsJp.timeZone = 'UTC';
//					$scope.OutWards[i].arriveDate = dateArrive.toLocaleDateString('ja-JP', optionsJp) + " " + hourminArrive;
//					$scope.OutWards[i].departDate = dateDepart.toLocaleDateString('ja-JP', optionsJp) + " " + hourminDepart;
//				}
	
//				//Format time hour
//				var duration = $scope.OutWards[i].duration;
//				var hour = Math.floor(duration / 60);
//				var min = duration % 60;
//				
//				if ($scope.language == "en") {
//					if(hour>= 1) {
//						if(min == 0) {
//							$scope.OutWards[i].duration = hour + "h";
//						} else {
//							$scope.OutWards[i].duration = hour + "h" + min + "m";
//						}
//					} else {
//						$scope.OutWards[i].duration = min + "m";
//					}
//					
//				} else {
//					if(hour>= 1) {
//						if(min == 0) {
//							$scope.OutWards[i].duration = hour + "時間";
//						} else {
//							$scope.OutWards[i].duration = hour + "時間" + min + "分";
//						}
//					} else {
//						$scope.OutWards[i].duration = min + "分";
//					}
//				}
				
			}
		}
		if (isRoundTrip) {
			if ($scope.results !=null && $scope.results.length > 0) {
				for (var i = 0; i < $scope.results.length; i++) {
//					for ( var j = 0; j < $scope.mapNameAir.length; j++) {
//						if ($scope.results[i].codeDestination == $scope.mapNameAir[j].codeAirport) {
//							if (language == "en") {
//								$scope.results[i].nameDestination = $scope.mapNameAir[j].nameAirportEn;
//								$scope.results[i].cityDestination = $scope.mapNameAir[j].nameCityEn;
//							} else {
//								$scope.results[i].nameDestination = $scope.mapNameAir[j].nameAirportJp;
//								$scope.results[i].cityDestination = $scope.mapNameAir[j].nameCityJp;
//							}
//						}
//						if ($scope.results[i].codeOrigin == $scope.mapNameAir[j].codeAirport) {
//							if (language == "en") {
//								$scope.results[i].nameOrigin = $scope.mapNameAir[j].nameAirportEn;
//								$scope.results[i].cityOrigin  = $scope.mapNameAir[j].nameCityEn;
//							} else {
//								$scope.results[i].nameOrigin = $scope.mapNameAir[j].nameAirportJp;
//								$scope.results[i].cityOrigin = $scope.mapNameAir[j].nameCityJp;
//							}
//						}
//					}
//					
//					for ( var j = 0; j < $scope.mapNameSupplier.length; j++) {
//						if ($scope.results[i].codeSupplier == $scope.mapNameSupplier[j].codeSupplier) {
//							if (language == "en") {
//								$scope.results[i].vendingOperatorAir = $scope.mapNameSupplier[j].nameSupplierEn;
//							} else {
//								$scope.results[i].vendingOperatorAir = $scope.mapNameSupplier[j].nameSupplierJp;
//							}
//							
//						}
//					}
//					
//					for ( var k = 0; k < $scope.mapCurrency.length; k++) {
//						if ($scope.results[i].currency == $scope.mapCurrency[k].codeCurrency) {
//							if (language == "en") {
//								$scope.results[i].currency = $scope.mapCurrency[k].CurrencyNameEn;
//							} else {
//								$scope.results[i].currency = $scope.mapCurrency[k].CurrencyNameJp;
//							}
//						}
//					}
					
					$scope.results[i].detail = getdetailsResults($scope.results[i].lstSegmentDetail);
					//format date
//					var yearDepart = $scope.results[i].departDate.substring(6, 10);
//					var monthDepart = $scope.results[i].departDate.substring(3, 5) - 1;
//					var dayDepart = $scope.results[i].departDate.substring(0, 2);
//					var hourminDepart = $scope.results[i].departDate.substring(11, 16);
//					var dateDepart = new Date(Date.UTC(yearDepart, monthDepart, dayDepart));	
//					
//					var yearArrive = $scope.results[i].arriveDate.substring(6, 10);
//					var monthArrive = $scope.results[i].arriveDate.substring(3, 5) - 1;
//					var dayArrive = $scope.results[i].arriveDate.substring(0, 2);
//					var hourminArrive = $scope.results[i].arriveDate.substring(11, 16);
//					var dateArrive = new Date(Date.UTC(yearArrive, monthArrive, dayArrive));
//		
//					if ($scope.language == "en") {
//						var optionsEn = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
//						optionsEn.timeZone = 'UTC';
//						$scope.results[i].arriveDate = dateArrive.toLocaleDateString('en-US', optionsEn) + " " + hourminArrive;
//						$scope.results[i].departDate = dateDepart.toLocaleDateString('en-US', optionsEn) + " " + hourminDepart;
//					} else {
//						var optionsJp = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' };
//						optionsJp.timeZone = 'UTC';
//						$scope.results[i].arriveDate = dateArrive.toLocaleDateString('ja-JP', optionsJp) + " " + hourminArrive;
//						$scope.results[i].departDate = dateDepart.toLocaleDateString('ja-JP', optionsJp) + " " + hourminDepart;
//					}
		
//					//Format time hour
//					var duration = $scope.results[i].duration;
//					var hour = Math.floor(duration / 60);
//					var min = duration % 60;
//					
//					
//					if ($scope.language == "en") {
//						if(hour>= 1) {
//							if(min == 0) {
//								$scope.results[i].duration = hour + "h";
//							} else {
//								$scope.results[i].duration = hour + "h" + min + "m";
//							}
//						} else {
//							$scope.results[i].duration = min + "m";
//						}
//						
//					} else {
//						if(hour>= 1) {
//							if(min == 0) {
//								$scope.results[i].duration = hour + "時間";
//							} else {
//								$scope.results[i].duration = hour + "時間" + min + "分";
//							}
//						} else {
//							$scope.results[i].duration = min + "分";
//						}
//					}
				}
			}
		}		
	}, 0);
	
	$scope.selectedOutwardId = "";
	$scope.selectedReturnId = "";

	$scope.total = 0;
	$scope.passengerOutward = "";
	$scope.passengerReturn = "";
	$scope.lstTotalOutward;
	$scope.lstTotalReturn;
	
	var totalOutward = 0;
	var totalReturn = 0;
	
	$scope.setOutWardIdSelected = function(outwardId) {
		
		//alert(outwardId);
		//Get id of routing choosed of outward
		$scope.selectedOutwardId = outwardId;
		
		//reset price total
		$scope.total = 0;

		//Update price total.
		//var priceOutward = dataObjOutWard.filter(function(v) {return v.id === $scope.selectedOutwardId;})[0];
		//alert($scope.OutWards);
		//var dataObjOutWard = angular.fromJSON($scope.OutWards);
		var priceOutward = $scope.OutWards.filter(function(v) {return v.id === $scope.selectedOutwardId;})[0];
		
		
		//save to totalOutward
		totalOutward = priceOutward.amount;
		
		//set price total
		$scope.total = totalOutward + totalReturn + $scope.surcharge;

		// set passengerPrice
		$scope.passengerOutward = priceOutward.passengerPrice;
		
		//set price detail		
		var lstTotal = $scope.OutWards.filter(function(v) {return v.id === $scope.selectedOutwardId;})[0].lstTotal;
		//Multilanguage for list price detail
		for(var l=0;l<lstTotal.length;l++){
			for ( var k = 0; k < $scope.mapPriceDetail.length; k++) {
				if (lstTotal[l].name == $scope.mapPriceDetail[k].priceNameEn) {
					if (language == "en") {
						lstTotal[l].name = $scope.mapPriceDetail[k].priceNameEn;
					} else {
						lstTotal[l].name = $scope.mapPriceDetail[k].priceNameJp;
					}
				}
			}
			
			for ( var k = 0; k < $scope.mapCurrency.length; k++) {
				if (lstTotal[l].currency == $scope.mapCurrency[k].codeCurrency) {
					if (language == "en") {
						lstTotal[l].currency = $scope.mapCurrency[k].CurrencyNameEn;
					} else {
						lstTotal[l].currency = $scope.mapCurrency[k].CurrencyNameJp;
					}
				}
			}
			
		}
		
		
		$scope.lstTotalOutward = lstTotal;
	}

	$scope.setReturnIdSelected = function(returnId) {
		
		//Get id of routing choosed of return
		$scope.selectedReturnId = returnId;
		
		//reset price total
		$scope.total = 0;

		//Update price total.
		//var priceReturn = dataObjReturn.filter(function(v) {return v.id === $scope.selectedReturnId;})[0];
		var priceReturn = $scope.results.filter(function(v) {return v.id === $scope.selectedReturnId;})[0];
		
		//save price to totalReturn
		totalReturn = priceReturn.amount;
		
		//set price total
		$scope.total = totalOutward + totalReturn + $scope.surcharge;
		
		// set passengerPrice
		$scope.passengerReturn = priceReturn.passengerPrice;
		
		//set price detail
		var lstTotal = $scope.results.filter(function(v) {return v.id === $scope.selectedReturnId;})[0].lstTotal;
		//Multilanguage for list price detail
		for(var l = 0; l < lstTotal.length; l++){
			for ( var k = 0; k < $scope.mapPriceDetail.length; k++) {
				if (lstTotal[l].name == $scope.mapPriceDetail[k].priceNameEn) {
					if (language == "en") {
						lstTotal[l].name = $scope.mapPriceDetail[k].priceNameEn;
					} else {
						lstTotal[l].name = $scope.mapPriceDetail[k].priceNameJp;
					}
				}
			}
			
			for ( var k = 0; k < $scope.mapCurrency.length; k++) {
				if (lstTotal[l].currency == $scope.mapCurrency[k].codeCurrency) {
					if (language == "en") {
						lstTotal[l].currency = $scope.mapCurrency[k].CurrencyNameEn;
					} else {
						lstTotal[l].currency = $scope.mapCurrency[k].CurrencyNameJp;
					}
				}
			}
		}
		$scope.lstTotalReturn = lstTotal;
	}
	
	// show dirty check dialog
	$scope.back = function () {
		if ($scope.selectedOutwardId != "" || $scope.selectedReturnId != "") {
			var r = confirm($scope.MSG020);
			if (r == true) {
				//$window.location.replace('./search');
				$window.location.href = './search';	
			}
		} else {
			//$window.location.replace('./search');
			$window.location.href = './search';	
		}
	}
	
	function isValidate(){
		var outwardSession = "";
		var returnSession = "";
		var objBookingDetail = "";
		var msg = "";
		
		if(!isRoundTrip) { //only outward
			if ($scope.selectedOutwardId == "") {				
				msg = $scope.MSG012;
			}
		} else { // outward and return
			if ($scope.selectedOutwardId == "" && $scope.selectedReturnId == "") {
				msg = $scope.MSG012;
			} else {
				if ($scope.selectedOutwardId == "") {
					msg = $scope.MSG013;
				}
				if ($scope.selectedReturnId == "") {
					msg = $scope.MSG014;
				} 
			}
		}
		return msg;
	}
	// click button booking
	$scope.chooseBooking = function() {
		
		var msg = isValidate();
		
		if (msg != "") {
			alert(msg);
			return;
		}
		
		//show progressBar
		$("#progressbar").addClass("ng-show").removeClass("ng-hide");
		$("#divcontent").addClass("ng-hide").removeClass("ng-show");
		
		var outwardSession = "";
		var returnSession = "";
		
		var objBookingDetail = new Object();	
		outwardSession = $scope.OutWards.filter(function(v) {return v.id === $scope.selectedOutwardId;})[0];
		objBookingDetail.outWardId = outwardSession.idflight;
		objBookingDetail.oRoutingId = outwardSession.routingId;
			
		 // outward and return
		if (isRoundTrip && $scope.selectedReturnId != "") {
				returnSession = $scope.results.filter(function(v) {return v.id === $scope.selectedReturnId;})[0];
				objBookingDetail.returnId = returnSession.idflight;
				objBookingDetail.rRoutingId = returnSession.routingId;
		}

		$http({
			method : 'POST',
			url : './bookingJSON',
			data : objBookingDetail,
			headers : {"Content-Type" : "application/json"}
		}).success(function(data, status, headers, config) {
			if((data.result.oMessApiErr != null && data.result.oMessApiErr != "") ||
					(data.result.rMessApiErr != null && data.result.rMessApiErr != "") ) {
				
				if(data.result.oMessApiErr != null) {
					$scope.oMessApiErr = $scope.MSG035 + data.result.oMessApiErr +"])";
				}
				
				if(data.result.rMessApiErr != null && data.result.rMessApiErr != "" ) {
					$scope.rMessApiErr = $scope.MSG035 + data.result.rMessApiErr +"])";
				}
				
				$scope.isErr = true;
				$("#apiErr").css("display","block");
				
				$("#progressbar").addClass("ng-hide").removeClass("ng-show");
				$("#divcontent").addClass("ng-show").removeClass("ng-hide");
				
			} else {
				
			if(angular.isUndefined(data.errors)){ // session time out
				if(lang == "en"){
					alert("Session timeout");
				} else {
					alert("セッションが切れました。");
				}			
				$window.location.replace('./search');
			} else if (data.errors.length == 0) { //success				
				$window.location.replace('./information');
			} else {  // has Error
				//hide progressBar
				$("#progressbar").addClass("ng-hide").removeClass("ng-show");
				$("#divcontent").addClass("ng-show").removeClass("ng-hide");
				var aryMsg = [];
				$.each(data.errors, function(i, o) {
					aryMsg[aryMsg.length] = o.errorMessage;
				});
				alert(aryMsg.join('\n'));
			}
			}
		}).error(function(data, status, headers, config) {
			var error = "./" + status;
			$window.location.replace(error);
		});
	}
	
	function getdetailsOutWard(pid) {
		var htmlContentOutWard="";
		for ( var i = 0; i < pid.length; i++) {

			var result = pid[i];
			result.arriveDateSgm = formatDate(result.arriveDateSgm, language);
			result.departDateSgm = formatDate(result.departDateSgm, language);
			
//			var yearDepart = result.departDateSgm.substring(6, 10);
//			var monthDepart = result.departDateSgm.substring(3, 5) - 1;
//			var dayDepart = result.departDateSgm.substring(0, 2);
//			var hourminDepart = result.departDateSgm.substring(11, 16);
//			var dateDepart = new Date(Date.UTC(yearDepart, monthDepart, dayDepart));	
//			
//			var yearArrive = result.arriveDateSgm.substring(6, 10);
//			var monthArrive = result.arriveDateSgm.substring(3, 5) - 1;
//			var dayArrive = result.arriveDateSgm.substring(0, 2);
//			var hourminArrive = result.arriveDateSgm.substring(11, 16);
//			var dateArrive = new Date(Date.UTC(yearArrive, monthArrive, dayArrive));
//
//			var depart = "";
//			var arrive = "";
//			if (language == "en") {
//				var optionsEn = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
//				optionsEn.timeZone = 'UTC';
//				result.arriveDateSgm = dateArrive.toLocaleDateString('en-US', optionsEn) + " " + hourminArrive;
//				result.departDateSgm = dateDepart.toLocaleDateString('en-US', optionsEn) + " " + hourminDepart;
//				depart = "Depart";
//				arrive = "Arrive";
//			} else {
//				var optionsJp = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' };
//				optionsJp.timeZone = 'UTC';
//				result.arriveDateSgm = dateArrive.toLocaleDateString('ja-JP', optionsJp) + " " + hourminArrive;
//				result.departDateSgm = dateDepart.toLocaleDateString('ja-JP', optionsJp) + " " + hourminDepart;
//				depart = "出発";
//				arrive = "到着";
//			}
			
			for ( var j = 0; j < $scope.mapNameAir.length; j++) {
				if (result.codeDestinationSgm == $scope.mapNameAir[j].codeAirport) {
					if (language == "en") {
						result.nameDestinationSgm = $scope.mapNameAir[j].nameAirportEn;
						result.cityDestination = $scope.mapNameAir[j].nameCityEn;
					} else {
						result.nameDestinationSgm = $scope.mapNameAir[j].nameAirportJp;
						result.cityDestination = $scope.mapNameAir[j].nameCityJp;
					}
				}
				if (result.codeOriginSgm == $scope.mapNameAir[j].codeAirport) {
					if (language == "en") {
						result.nameOriginSgm = $scope.mapNameAir[j].nameAirportEn;
						result.cityOrigin = $scope.mapNameAir[j].nameCityEn;
					} else {
						result.nameOriginSgm = $scope.mapNameAir[j].nameAirportJp;
						result.cityOrigin = $scope.mapNameAir[j].nameCityJp;
					}
				}
			}
			
			for ( var j = 0; j < $scope.mapNameSupplier.length; j++) {
				if (result.codeSupplier == $scope.mapNameSupplier[j].codeSupplier) {
					if (language == "en") {
						result.vendingOperatorAirSgm = $scope.mapNameSupplier[j].nameSupplierEn;
					} else {
						result.vendingOperatorAirSgm = $scope.mapNameSupplier[j].nameSupplierJp;
					}
					
				}
			}
			
			
		htmlContentOutWard = htmlContentOutWard + "<tr>";
		htmlContentOutWard = htmlContentOutWard + "<td colspan='3'>";
		htmlContentOutWard = htmlContentOutWard + "<div>";
		htmlContentOutWard = htmlContentOutWard + result.vendingOperatorAirSgm;
		htmlContentOutWard = htmlContentOutWard + "</div>";
		htmlContentOutWard = htmlContentOutWard + "<div>";
		htmlContentOutWard = htmlContentOutWard + result.flightIdAirSgm;
		htmlContentOutWard = htmlContentOutWard + "</div>";
		htmlContentOutWard = htmlContentOutWard + "<div>";
		htmlContentOutWard = htmlContentOutWard + result.fareName;
		htmlContentOutWard = htmlContentOutWard + "</div>";
		htmlContentOutWard = htmlContentOutWard + "<div>";
		htmlContentOutWard = htmlContentOutWard + result.tfClass;
		htmlContentOutWard = htmlContentOutWard + "</div>";
		htmlContentOutWard = htmlContentOutWard + "</td>";
		htmlContentOutWard = htmlContentOutWard + "</tr>";
		htmlContentOutWard = htmlContentOutWard + "<tr>";
		htmlContentOutWard = htmlContentOutWard + "<td width='10%' class='rightAlign'>" +depart+"</td>";
		htmlContentOutWard = htmlContentOutWard + "<td width='30%' class='centerAlign'>";
		htmlContentOutWard = htmlContentOutWard + result.departDateSgm;
		htmlContentOutWard = htmlContentOutWard + "</td>";
		htmlContentOutWard = htmlContentOutWard + "<td width='60%'>";
		htmlContentOutWard = htmlContentOutWard + result.codeOriginSgm;
		htmlContentOutWard = htmlContentOutWard + " ";
		
		if(result.nameOriginSgm != null) {
			htmlContentOutWard = htmlContentOutWard + " ";
			htmlContentOutWard = htmlContentOutWard + result.nameOriginSgm;
		}
		
		htmlContentOutWard = htmlContentOutWard + "</td></tr>";
		htmlContentOutWard = htmlContentOutWard + "<tr>";
		htmlContentOutWard = htmlContentOutWard + "<td width='10%' class='rightAlign'>"+arrive+"</td>";
		htmlContentOutWard = htmlContentOutWard + "<td width='30%' class='centerAlign'>";
		htmlContentOutWard = htmlContentOutWard + result.arriveDateSgm;
		htmlContentOutWard = htmlContentOutWard + "</td>";
		htmlContentOutWard = htmlContentOutWard + "<td width='60%'>";
		htmlContentOutWard = htmlContentOutWard + result.codeDestinationSgm;
		htmlContentOutWard = htmlContentOutWard + " ";
		
		if(result.nameDestinationSgm != null) {
			htmlContentOutWard = htmlContentOutWard + " ";
			htmlContentOutWard = htmlContentOutWard + result.nameDestinationSgm;
		}
		htmlContentOutWard = htmlContentOutWard + "</td></tr>";
		
		}
		return htmlContentOutWard;
	}
	
	function getdetailsResults(pid) {
		var htmlContentReturn = "";
		for ( var i = 0; i < pid.length; i++) {

			var result = pid[i];
			result.arriveDateSgm = formatDate(result.arriveDateSgm, language);
			result.departDateSgm = formatDate(result.departDateSgm, language);
			
//			var yearDepart = result.departDateSgm.substring(6, 10);
//			var monthDepart = result.departDateSgm.substring(3, 5) - 1;
//			var dayDepart = result.departDateSgm.substring(0, 2);
//			var hourminDepart = result.departDateSgm.substring(11, 16);
//			var dateDepart = new Date(Date.UTC(yearDepart, monthDepart, dayDepart));	
//			
//			var yearArrive = result.arriveDateSgm.substring(6, 10);
//			var monthArrive = result.arriveDateSgm.substring(3, 5) - 1;
//			var dayArrive = result.arriveDateSgm.substring(0, 2);
//			var hourminArrive = result.arriveDateSgm.substring(11, 16);
//			var dateArrive = new Date(Date.UTC(yearArrive, monthArrive, dayArrive));
//
//			if (language == "en") {
//				var optionsEn = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
//				optionsEn.timeZone = 'UTC';
//				result.arriveDateSgm = dateArrive.toLocaleDateString('en-US', optionsEn) + " " + hourminArrive;
//				result.departDateSgm = dateDepart.toLocaleDateString('en-US', optionsEn) + " " + hourminDepart;
//				depart = "Depart";
//				arrive = "Arrive";
//			} else {
//				var optionsJp = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' };
//				optionsJp.timeZone = 'UTC';
//				result.arriveDateSgm = dateArrive.toLocaleDateString('ja-JP', optionsJp) + " " + hourminArrive;
//				result.departDateSgm = dateDepart.toLocaleDateString('ja-JP', optionsJp) + " " + hourminDepart;
//				depart = "出発";
//				arrive = "到着";
//			}

			for ( var j = 0; j < $scope.mapNameAir.length; j++) {
				
				if (result.codeDestinationSgm == $scope.mapNameAir[j].codeAirport) {
					if (language == "en") {
						result.nameDestinationSgm = $scope.mapNameAir[j].nameAirportEn;
						result.cityDestination = $scope.mapNameAir[j].nameCityEn;
					} else {
						result.nameDestinationSgm = $scope.mapNameAir[j].nameAirportJp;
						result.cityDestination = $scope.mapNameAir[j].nameCityJp;
					}
				}
				if (result.codeOriginSgm == $scope.mapNameAir[j].codeAirport) {
					if (language == "en") {
						result.nameOriginSgm = $scope.mapNameAir[j].nameAirportEn;
						result.cityOrigin = $scope.mapNameAir[j].nameCityEn;
					} else {
						result.nameOriginSgm = $scope.mapNameAir[j].nameAirportJp;
						result.cityOrigin = $scope.mapNameAir[j].nameCityJp;
					}
				}
			}
			
			for ( var j = 0; j < $scope.mapNameSupplier.length; j++) {
				if (result.codeSupplier == $scope.mapNameSupplier[j].codeSupplier) {
					if (language == "en") {
						result.vendingOperatorAirSgm = $scope.mapNameSupplier[j].nameSupplierEn;
					} else {
						result.vendingOperatorAirSgm = $scope.mapNameSupplier[j].nameSupplierJp;
					}
					
				}
			}
			
		htmlContentReturn = htmlContentReturn + "<tr>";
		htmlContentReturn = htmlContentReturn + "<td colspan='3'>";
		htmlContentReturn = htmlContentReturn + "<div>";
		htmlContentReturn = htmlContentReturn + result.vendingOperatorAirSgm;
		htmlContentReturn = htmlContentReturn + "</div>";
		htmlContentReturn = htmlContentReturn + "<div>";
		htmlContentReturn = htmlContentReturn + result.flightIdAirSgm;
		htmlContentReturn = htmlContentReturn + "</div>";
		htmlContentReturn = htmlContentReturn + "<div>";
		htmlContentReturn = htmlContentReturn + result.fareName;
		htmlContentReturn = htmlContentReturn + "</div>";
		htmlContentReturn = htmlContentReturn + "<div>";
		htmlContentReturn = htmlContentReturn + result.tfClass;
		htmlContentReturn = htmlContentReturn + "</div>";
		htmlContentReturn = htmlContentReturn + "</td>";
		htmlContentReturn = htmlContentReturn + "</tr>";
		htmlContentReturn = htmlContentReturn + "<tr>";
		htmlContentReturn = htmlContentReturn + "<td width='10%' class='rightAlign'>" +depart+"</td>";
		htmlContentReturn = htmlContentReturn + "<td width='30%' class='centerAlign'>";
		htmlContentReturn = htmlContentReturn + result.departDateSgm;
		htmlContentReturn = htmlContentReturn + "</td>";
		htmlContentReturn = htmlContentReturn + "<td width='60%'>";
		htmlContentReturn = htmlContentReturn + result.codeOriginSgm;
		htmlContentReturn = htmlContentReturn + " ";
		
		if(result.nameOriginSgm != null) {
			htmlContentReturn = htmlContentReturn + " ";
			htmlContentReturn = htmlContentReturn + result.nameOriginSgm;
		}
		htmlContentReturn = htmlContentReturn + "</td></tr>";
		htmlContentReturn = htmlContentReturn + "<tr>";
		htmlContentReturn = htmlContentReturn + "<td width='10%' class='rightAlign'>"+arrive+"</td>";
		htmlContentReturn = htmlContentReturn + "<td width='30%' class='centerAlign'>";
		htmlContentReturn = htmlContentReturn + result.arriveDateSgm;
		htmlContentReturn = htmlContentReturn + "</td>";
		htmlContentReturn = htmlContentReturn + "<td width='60%'>";
		htmlContentReturn = htmlContentReturn + result.codeDestinationSgm;
		htmlContentReturn = htmlContentReturn + " ";
		
		if(result.nameDestinationSgm != null) {
			htmlContentReturn = htmlContentReturn + " ";
			htmlContentReturn = htmlContentReturn + result.nameDestinationSgm;
		}
		htmlContentReturn = htmlContentReturn + "</td></tr>";
		}

		return htmlContentReturn;
	}
		});
	});
});
