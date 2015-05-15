$(function() {

	var toggleTerminal = $('#toggleTerminal');
	var terminal = $('#terminal');
	var statsSwitch = 1;

// animation speed
var fast = 300;

terminal.animate({top: '-=300',}, 0);

toggleTerminal.click( function() 
{
	if(!terminal.is(':animated')) 
	{
		if ( statsSwitch == 1 ) 
		{
			terminal.animate({top: '+=300',}, fast);
			statsSwitch = 2;
			toggleTerminal.text('Hide Terminal');
		}
		else 
		{
			terminal.animate({top: '-=300',}, fast);
			statsSwitch = 1;
			toggleTerminal.text('Show Terminal');
		}
	}
	return false;
});

});