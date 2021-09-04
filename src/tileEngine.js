import tileset from './assets/tiles.png';

class ImageLoader{
	constructor(obj)
	{
		this.images= {};
	}

	loadImage= (key, src) =>{
		const img= new Image();
		const d= new Promise((resolve, reject) => {
			img.onload= () => {
				this.images[key]= img;
				resolve(img);
			};

			img.onerror= () => {
				reject('Could not load image: ' + src);
			};
		});

		img.src = src;
		return d;
	};

	getImage= key => {
		return (key in this.images) ? this.images[key] : null;
	};
}

class TileEngine{
	constructor(obj)
	{
		this.ready= false;
		this.gameObject= obj;
		this.Loader= new ImageLoader();

		Promise.all([
			this.Loader.loadImage('tiles', tileset)
		])
		.then(loaded => {
			this.tileAtlas= this.Loader.getImage('tiles');
		})
		.then(() => {
			this.ready= true;
		})
		.catch(err => {
			console.log(err);
		});	
	}

	Start= () => {
		this.map= {
			cols: 16,
			rows: 16,
			tsize: 64,
			tiles: [
				1, 3, 3, 3, 1, 1, 3, 1, 1, 3, 3, 3, 1, 1, 3, 1,
				1, 3, 3, 3, 1, 1, 3, 1, 1, 3, 3, 3, 1, 1, 3, 1,
				1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
				1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
				1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 1,
				1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 1,
				1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
				1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
				1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1,
				1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1,
				1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1,
				1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1,
				1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1,
				1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1,
				1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1,
				1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1,
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
		if(!this.ready) return;

		for (var c = 0; c < this.map.cols; c++) 
		{
			for (var r = 0; r < this.map.rows; r++) 
			{
				var tile = this.map.getTile(c, r);
				if (tile !== 0) 
				{ // 0 => empty tile
					context.save();
					context.scale(1, -1);
					context.translate(-width/2, -height/2);
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
					context.restore();
				}
			}
		}
	}
}

export default TileEngine;
