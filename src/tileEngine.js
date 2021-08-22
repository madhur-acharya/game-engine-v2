import tileset from './assets/tiles.png';

class TileEngine{
	constructor(obj)
	{
		this.gameObject= obj;
		this.Loader = {
			images: {}
		};

		this.Loader.loadImage = function (key, src) 
		{
			var img = new Image();

			var d = new Promise(function (resolve, reject) 
			{
				img.onload = function () 
				{
					this.images[key] = img;
					resolve(img);
				}.bind(this);

				img.onerror = function () 
				{
					reject('Could not load image: ' + src);
				};
			}.bind(this));

			img.src = src;
			return d;
		};

		this.Loader.getImage = function (key) {
			return (key in this.images) ? this.images[key] : null;
		};

		Promise.all([
			this.Loader.loadImage('tiles', tileset)
		]).then(loaded => {
			this.tileAtlas= this.Loader.getImage('tiles');
		})
		.catch(err => {
			console.log(err);
		});	
	}

	Start= () => {
		this.map = {
			cols: 8,
			rows: 8,
			tsize: 64,
			tiles: [
				1, 3, 3, 3, 1, 1, 3, 1,
				1, 1, 1, 1, 1, 1, 1, 1,
				1, 1, 1, 1, 1, 2, 1, 1,
				1, 1, 1, 1, 1, 1, 1, 1,
				1, 1, 1, 2, 1, 1, 1, 1,
				1, 1, 1, 1, 2, 1, 1, 1,
				1, 1, 1, 1, 2, 1, 1, 1,
				1, 1, 1, 1, 2, 1, 1, 1
			],
			getTile: (col, row) => {
				return this.map.tiles[row * this.map.cols + col];
			}
		};
	}

	Update= delta => {
		this.render();
	}

	render= () => {
		for (var c = 0; c < this.map.cols; c++) 
		{
			for (var r = 0; r < this.map.rows; r++) 
			{
				var tile = this.map.getTile(c, r);
				if (tile !== 0) 
				{ // 0 => empty tile
					context.drawImage(
						this.tileAtlas, // image
						(tile - 1) * this.map.tsize, // source x
						0, // source y
						this.map.tsize, // source width
						this.map.tsize, // source height
						c * this.map.tsize,  // target x
						r * this.map.tsize, // target y
						this.map.tsize, // target width
						this.map.tsize // target height
					);
				}
			}
		}
	}
}

export default TileEngine;
