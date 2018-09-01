var Camera = Vector3.extend
({
	up: null,
	target: null,
	zoom: null,
	focus: null,
	roll: null,
	
	matrix: null,
	
	init: function(x, y, z)
	{
		this._super(x, y, z);
		this.up = new Vector3( 0, 1, 0 );
		this.target = new Vector3( 0, 0, 0 );
		this.zoom = 3;
		this.focus = 500;
		this.roll = 0;
		
		this.matrix = new Matrix4();
	},
	
	updateMatrix: function()
	{
		this.matrix.lookAt( this, this.target, this.up );
	},

	toString: function()
	{
		return 'Camera ( ' + this.x + ', ' + this.y + ', ' + this.z + ' )';
	}
});
