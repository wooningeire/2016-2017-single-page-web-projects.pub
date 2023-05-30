function incSp(scale) {
	document.body.removeChild(document.querySelector(".ad-wrap"));
	
	var products = [
		Math.pow(scale, -1) * 100,
		scale * -200 + Math.pow(scale, -1) * 100
	];
	document.querySelector("#flash").style =
		"transform: scale(" + scale + "); min-height: " + products[0] + "vh; width: " + products[0] + "vw; margin-top: " + products[1] + "vh; margin-left: " + products[1] + "vw";
}

incSp(.75);