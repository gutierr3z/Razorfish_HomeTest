/*
-------------------------------------------------------------
MODULE: 	PLD.test
AUTHOR: 	Juan C. Gutierrez
DATE: 		12/28/2012
-------------------------------------------------------------
*/
var PLD = PLD || {};
PLD.test = ( function() {
	/*
	-------------------------------------------------------------
	Addition of indexOf() function because IE lacks...
	-------------------------------------------------------------
	*/
	Array.prototype.indexOf = function( obj, start ) {
		 for ( var i = ( start || 0 ), j = this.length; i < j; i++ ) {
			 if ( this[i] === obj ) { return i; }
		 }
		 return -1;
	}
	/*
	-------------------------------------------------------------
	PRIVATE VARIABLES
	-------------------------------------------------------------
	*/
	var monthName = new Array();							// english month names
		monthName[0]="January";
		monthName[1]="February";
		monthName[2]="March";
		
		monthName[3]="April";
		monthName[4]="May";
		monthName[5]="June";
		
		monthName[6]="July";
		monthName[7]="August";
		monthName[8]="September";
		
		monthName[9]="October";
		monthName[10]="November";
		monthName[11]="December";
		
	var dateNow = new Date();								// new date obj
	var currentMonth = dateNow.getMonth();					// today's month
	var currentYear = dateNow.getFullYear();				// today's year
	var Qs = [												// end of every quarter
		2, // Q1 - 2 March
		5, // Q2 - 5 June
		8, // Q3 - 8 September
		11 // Q4 - 11 December
	];
	var chkCounter = [];									// checkbox counter keeps track of how many are checked
	// DOM dipping
	var qs = document.getElementById( 'qs' );				// TD parent of checkboxes
	var qsLI = qs.getElementsByTagName( 'li' );				// LI parent of checkboxes 
	var warning = document.getElementById( 'warning' );		// warning message div
	var noJS = document.getElementById( 'noJS' );			// TR with year input for when js doesnt work
	/*
	-------------------------------------------------------------
	PRIVATE FUNCTIONS
	-------------------------------------------------------------
	*/
	/**
	@function: 		_enhanceHideNoJS
	
	@Description: 	Hides TR which holds input for year to be used if JS is not active.
					Hides 4th checkbox used as 4th quarter checkbox when JS is not active.
	
	@return 		{undefined}
	**/
	function _enhanceHideNoJS() {
		
		// hide TR with no js input
		noJS.style.display = 'none';
		// hide checkbox for 4th quarter for no js
		qsLI[ 3 ].style.display = 'none';
	}
	/*
	-------------------------------------------------------------
	*/
	/**
	@function: 		_getQuarter
	
	@Description: 	Identifies the present quarter and passes next quarter
	
	@month			number
	@year			number
	
	@return 		{undefined}
	**/
	function _getQuarter( month, year ) {	
	
		// loop through array of quarter endings
		for( var i = 0, len = Qs.length; i < len; i++ ) {
			// if current month int is less or equal to current arrays value
			if( month <= Qs[ i ] ) {
				// draw the quarters passing in arrays month value(+1) 
				// and passed in year from select constructor
				_threeNextQuarters( i + 1, year );
				// break loop if match
				break;
			}
		}
	}
	/*
	-------------------------------------------------------------
	*/
	/**
	@function: 		_threeNextQuarters
	
	@Description: 	Identifies the following 3 quarters and corresponding year.
					Passes to function that changes the DOM.
	
	@month			number
	@year			number
	
	@return 		{undefined}
	**/
	function _threeNextQuarters( id, year ) {
		
		// month int from array plus one for next quarter
		var counter = id + 1;
		// new date obj with values passed in
		var dateObj = new Date( year, counter );
		// loop for next 3 quarters
		for( var i = 0; i < 3; i++ ) {
			// if counter goes into 5th quarter
			if( counter == 5 ) {
				// set counter back for first quarter
				counter = 1;
				// set year for labels plus one for quarter after 4th
				dateObj.setFullYear( dateObj.getFullYear() + 1 );
			}
			// draw out checkboxes, i for first, second, third checkboxes
			_chgDOMCheckboxes( i, 'Q' + counter, dateObj.getFullYear() );
			// increase quarter counter
			counter++;		
		}
	}
	/*
	-------------------------------------------------------------
	*/
	/**
	@function: 		_chgDOMCheckboxes
	
	@Description: 	Changes the DOM to show next 3 quarter checkboxes.
	
	@id				number
	@val			string
	@year			number
	
	@return 		{undefined}
	**/
	function _chgDOMCheckboxes( id, val, year ) {
		
		// grab elements
		var lbl = qsLI[ id ].getElementsByTagName( 'label' );	// Label inside LI for checkbox
		var chkV = qsLI[ id ].getElementsByTagName( 'input' );	// checkbox input elem
		// change value attribute
		chkV[0].setAttribute( 'value', val + '-' + year );
		// change label to Qx and year
		lbl[0].innerHTML = val + ' ' + year;
		
		// add event to select for NN/standard based
		if ( chkV[0].addEventListener ) {
			// click on checkboxes
			chkV[0].addEventListener( 'click', function() { _chkChangeEvent( chkV[0].getAttribute( 'id' ) ) }, false );
		// add event to select for IE 
		} else if( chkV[0].attachEvent ) {
			// click on checkboxes
			chkV[0].attachEvent( 'onclick', function() { _chkChangeEvent( chkV[0].getAttribute( 'id' ) ) } );
		}
	}
	/*
	-------------------------------------------------------------
	*/
	/**
	@function: 		_chkChangeEvent
	
	@Description: 	Handles what happens when a checkbox is checked.
					Keeps track of what checkbox got checked and/or unchecked.
					Displays the warning sign.
	
	@chkId			string
	
	@return 		{undefined}
	**/
	function _chkChangeEvent( chkId ) {
		
		// grab element that triggered event
		var chkIdElem = document.getElementById( chkId );
		// flag that keep track of num of checkboxes checked, false meaning its empty
		var thisChkInCounter = false;
		
		// CHECKED ---------------------------------
		if( chkIdElem.checked == true ) {
			// loop through counter to see if checked checkbox in already in counter
			_loopCounter();
			// if checked checkbox is not in counter array
			if( thisChkInCounter == false ) {
				// if the counter has 2 or less items
				if( chkCounter.length < 2 ) {
					// include checkbox into counter array
					chkCounter.push( chkId );
				// if counter already has 2 or more items
				} else {
					// display the warning sign
					warning.style.display = 'block';
					// prevent checkbox from being checked
					chkIdElem.checked = false;
				}
			}
			
		// UNCHECKED ---------------------------------
		} else if( chkIdElem.checked == false ) {
			// loop through counter to see if checked checkbox in already in counter
			_loopCounter();
			// if unchecked checkbox is already in counter array
			if( thisChkInCounter == true ) {
				// get index of it in array
				var index = chkCounter.indexOf( chkId );
				// delete checkbox from counter
				chkCounter.splice( index, 1 );
				// if the counter has 2 or less items
				if( chkCounter.length < 2 ) {
					// hide the warning sign
					warning.style.display = 'none';
				}
			}
		}
		
		function _loopCounter() {
			// loop through checked checkbox counter
			for( var j = 0, len = chkCounter.length; j < len; j++ ) {
				// check if checked-on checkbox is in counter array already
				// meaning already checked
				if( chkCounter[ j ] == chkId ) {
					// mark true if checkbox is already checked
					thisChkInCounter = true;
					// break the loop
					break;
				// if checkbox is not in counter
				} else if( chkCounter[ j ] != chkId ) {
					// mark as false if checkbox is not in counter
					thisChkInCounter = false;
				}
			}
		}
	}
	/*
	-------------------------------------------------------------
	*/
	/**
	@function: 		_chgDOMSelect
	
	@Description: 	Handles the select element.
					Deletes original select and creates a new one with new options.
					Adds event for when select changes
	
	@month			number
	@year			number
	
	@return 		{undefined}
	**/
	function _chgDOMSelect( month, year ) {
		
		// get select element
		var invCycle = document.getElementById( 'invCycle' );	// select control
		// get parent of select element
		var selParent = invCycle.parentNode;
		// from parent, remove original select element
		selParent.removeChild( invCycle );
		
		// create new select element
		var newSel = document.createElement( 'select' );
		// give new select an id
		newSel.setAttribute( 'id', 'newSel' );
		// create the first input of new select
		var opt = document.createElement( 'option' );
		// create text of first option
		var txt = document.createTextNode( monthName[ month ] + ' ' + year );
		
		// give value attribute to new option
		opt.setAttribute( 'value', month + '-' + year );
		// append new text into option
		opt.appendChild( txt );
		// append new option into new select
		newSel.appendChild( opt );
		
		// variables to hold new options and their text
		var newOpt;
		var newTxt;
		
		// new date obj based on month and year passed in
		var dateObj = new Date( year, month );
		
		// create new options for 12 months from now
		for( var i = 1; i <= 12; i++ ) {
			dateObj.setMonth( dateObj.getMonth() + 1 );
			newOpt = document.createElement( 'option' );
			newTxt = document.createTextNode( monthName[ dateObj.getMonth() ] + ' ' + dateObj.getFullYear() );
			newOpt.setAttribute( 'value', dateObj.getMonth() + '-' + dateObj.getFullYear() );
			newOpt.appendChild( newTxt );
			newSel.appendChild( newOpt );
		}
		// append options to new select
		selParent.appendChild( newSel );
		// draw quarters based on default current date
		_getQuarter( month, year );
		
		// add event to select for NN/standard based
		if ( newSel.addEventListener ) {
			newSel.addEventListener( 'change', _selChangeEvent, false);
		// add event to select for IE 
		} else if( newSel.attachEvent ) {
			newSel.attachEvent( 'onchange', _selChangeEvent );
		}
	}
	/*
	-------------------------------------------------------------
	*/
	/**
	@function: 		_selChangeEvent
	
	@Description: 	Handles when select element changes option.
					Invokes checkboxes to go hand in hand with date of select
	
	@return 		{undefined}
	**/
	function _selChangeEvent() {
		
		// new select element to replace original
		var newSel = document.getElementById( 'newSel' );
		// grab the index of selected option
		var newSelIndex = newSel.selectedIndex;
		// get value of selected option
		var optValue = newSel[ newSelIndex ].getAttribute( 'value' );
		// split value into array
		var arrValue = optValue.split( '-' );
		
		// draw quarters based on select option values
		_getQuarter( arrValue[ 0 ], arrValue[ 1 ] );
		
		// when select change: Reset all checkboxes
		for( var i = 0, len = qs.getElementsByTagName( 'input' ).length; i < len; i++ ) {
			qs.getElementsByTagName( 'input' )[ i ].checked = false;
		}
		// when select change: clear checkbox counter
		chkCounter = [];
		// when select change: hide warning message
		warning.style.display = 'none';
	}
	/*
	-------------------------------------------------------------
	*/
	/**
	@function: 		_init
	
	@Description: 	Initiates it all... 
	
	@m				number
	@y				number
	
	@return 		{undefined}
	**/
	function _init( m, y ) {
		
		// default values
		var M = m || currentMonth;
		var Y = y || currentYear;
		// hide all none JS elements
		_enhanceHideNoJS();
		// draw new select
		_chgDOMSelect( M, Y );
	}
	/*
	-------------------------------------------------------------
	*/
	/**
	public API
	**/
	return {
		init: _init
	}

})();