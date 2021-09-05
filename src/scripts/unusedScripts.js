const spawnPlayer= () => {
	const player= new GameObject(new Vector(0, -height / 3), new Vector(), false, false);
	player.alias= "player";
	player.type= "player";
	player.health= 10;
	player.healthCap= 10;
	player.layer= "projectile";
	player.damage= 1;

	player.renderer= (gameObject) => {
		context.save();
		context.translate(gameObject.position.x, gameObject.position.y);
		context.rotate(gameObject.shootDirection || 0);
		context.beginPath();
		context.fillStyle= "white";
		context.moveTo(25, 0);
		context.lineTo(-10, -15);
		context.lineTo(0, 0);
		context.lineTo(-10, 15);
		context.lineTo(25, 0);
		context.fill();

		if(Math.round(time / 10) % 2 == true)
		{
			context.strokeStyle= "red";
			context.beginPath();
			context.moveTo(0, 0);
			context.lineTo(-10, 3);
			context.moveTo(0, 0);
			context.lineTo(-10, -3);
			context.moveTo(0, 0);
			context.lineTo(-15, 0);
			context.stroke();
		}
		context.restore();
	};

	player.executables.unshift(playerMovementSnappy);
	player.executables.push(obj => drawDossHealthBar(obj, new Vector(-(width/2) + 120, 20), 200, ["black", "white"]));
	player.addTimer("firerate", new Timer());
	player.addTimer("superrate", new Timer());
	player.firerate= 100;
	player.superrate= 5000;
	player.timers.superrate.start_time= -(time + 5000);
	player.executables.push(obj => {
		context.save();
		context.translate(-(width/2) + 20, -(height/2) + 10);
		context.beginPath();
		context.fillStyle= "grey";
		let length= Math.round(obj.timers.superrate.getDuration()) / 40;
		length= length < 250 ? length : 250;
		context.fillRect(0, 0, length, 10);
		context.restore();
	});
	player.addCollider({
		type: "circle",
		radius: 15,
		uncolide: true,
		onCollision: (current, other) => {
			if(other.alias === "enemy" || other.alias === "enemyProjectile")
			{
				if(!current.disableCollisionDetection)
				{
					current.health-= 1;
					other.velocity= new Vector(-other.velocity.x, -other.velocity.y);
					current.disableCollisionDetection= true;
					TimeOut.newTimeOut(() => {
						current.disableCollisionDetection= false;
					}, 200);
				}
				
				if(current.health <= 0)
				{
					current.destroy();
				}
			}
		}
	});

	player.onDestroy= gameObject => {
		EventSystem.dispatchEvent("onPlayerDeath");
	}

	return player;
};

function spawnTheHive(player, delay= 3000, spawnsPerRound= 5)
{
	const TheHive= new GameObject(getRandomVector(), getRandomVector(3, 3));
	TheHive.alias= "enemy";
	TheHive.layer= "projectile";
	TheHive.health= 100;
	TheHive.healthCap= 100;
	TheHive.executables.push(drawDossHealthBar);
	TheHive.addTimer("firerate", new Timer());
	TheHive.spawnsPerRound= spawnsPerRound;
	TheHive.phase= 1;
	TheHive.firerate= delay;

	TheHive.addCollider({
		type: "circle",
		radius: 35,
		uncolide: false,
		computeBoundryCollision: true,
		onCollision: (current, other) => {
			if(other.alias === "playerProjectile")
			{
				current.health-= other.damage || 1;
				if(current.health <= current.healthCap / 2 && current.phase === 1)
				{
					current.spawnsPerRound= Math.round(current.spawnsPerRound * 1.5);
					current.phase= 2;
				}
				if(current.health <= 0)
				{
					current.destroy();
					gameObjectList= gameObjectList.filter((itm, indx) => itm.alias === "player");
					EventSystem.dispatchEvent("onBossDeath");
				}
			}
		}
	});

	TheHive.renderer= gameObject => {
		context.save();
		context.translate(gameObject.position.x, gameObject.position.y);
		context.beginPath();
		context.fillStyle= "white";
		context.arc(0, 0, gameObject.collider.radius, 0, Math.PI * 2);
		context.fill();
		context.restore();
	};

	TheHive.executables.unshift(gameObject => {

		if(gameObject.timers.firerate)
		{	
			if(gameObject.timers.firerate.getDuration() > (gameObject.firerate || 1000))
			{
				gameObject.timers.firerate.reset();
				
				let slice= (Math.PI * 2) / TheHive.spawnsPerRound, 
				angle= 0;
				for(let i= 0; i < TheHive.spawnsPerRound; i++)
				{
					const vel= new Vector(0, 0);
					vel.setMag(5);
					vel.setAngle(angle);

					spawnKaamakazi(player, TheHive.position, vel), 2000;
					angle= angle + slice;
				}
			}
		}
	});

	return spawnTheHive;
}

function spawnDrFatal(player, delay= 350, projectileCount= 10)
{
	const drFatal= spawnXPloder(new Vector(), projectileCount, 15, delay);
	drFatal.alias= "enemy";
	drFatal.layer= "projectile";
	drFatal.health= 150;
	drFatal.healthCap= 150;
	drFatal.executables.push(drawDossHealthBar);
	drFatal.phase= 1;
	drFatal.flag= false;
	drFatal.velocity= getRandomVector(1, 1);
	drFatal.projectileSpeed= 4;

	drFatal.addCollider({
		type: "circle",
		radius: 35,
		uncolide: true,
		computeBoundryCollision: true,
		onCollision: (current, other) => {
			if(other.alias === "playerProjectile")
			{
				current.health-= other.damage || 1;
				if(current.health <= current.healthCap / 2 && current.phase === 1)
				{
					current.projectileCount= Math.round(current.projectileCount * 1.5);
					current.projectileSpeed= 7;
					current.phase= 2;
				}
				if(current.health <= 0)
				{
					current.destroy();
					gameObjectList= gameObjectList.filter((itm, indx) => itm.alias === "player");
					EventSystem.dispatchEvent("onBossDeath");
				}
			}
		}
	});

	drFatal.executables.unshift(gameObject => {

		if(gameObject.timers.firerate)
		{	
			if(gameObject.timers.firerate.getDuration() > (gameObject.firerate || 1000))
			{
				gameObject.timers.firerate.reset();
				const off= Vector.subtraction(player.position, gameObject.position).getAngle();
				bulletSplosion(gameObject.position, gameObject.projectileCount, 15, off, gameObject.projectileSpeed);
			}
		}
	});

	return spawnTheHive;
}

function spawnKaamakazi(player, position= new Vector(), velocity= getRandomVector(5,5), delay= 1000)
{
	const kaamakazi= new GameObject( position, velocity);
	kaamakazi.alias= "enemy";
	kaamakazi.layer= "projectile";
	kaamakazi.type= "kaamakazi";
	kaamakazi.health= 1;
	kaamakazi.healthCap= 1;
	kaamakazi.velocityCap= Math.round(Math.random() * 5 + 1);
	kaamakazi.disableCollisionDetection= true;

	kaamakazi.renderer= (gameObject, damaged= false) => {

		context.beginPath();
		context.strokeStyle= "white";
		context.fillStyle= "white";
		context.save();
		context.translate(gameObject.position.x, gameObject.position.y);
		context.rotate(gameObject.velocity.getAngle() - Math.PI / 2);
		context.arc(0, 0, gameObject.collider.radius, 0, Math.PI * 2);
		context.moveTo(-(gameObject.collider.radius), 0);
		context.lineTo(0, -gameObject.collider.radius * 3);
		context.lineTo((gameObject.collider.radius), 0);
		context.fill();
		context.restore();
	};

	kaamakazi.addCollider({
		type: "circle",
		radius: 10,
		uncolide: true,
		computeBoundryCollision: false,
		onCollision: (current, other) => {
			if(other.alias === "playerProjectile")
			{
				current.health-= other.damage || 1;
				if(current.health <= 0)
				{
					current.destroy();
				}
			}
			else if(other.type === "kaamakazi")
			{
				current.velocity= Vector.addition(current.velocity, getRandomVector(1, 1)) ;
			}
		}
	});

	TimeOut.newTimeOut(() => {
		kaamakazi.acceleration= new Vector(0.5, 0);
		kaamakazi.disableCollisionDetection= false;
		kaamakazi.executables.unshift(gameObject => {
			const temp_vect= Vector.subtraction(player.position, gameObject.position);
			gameObject.acceleration.setAngle(temp_vect.getAngle());
		});
	}, delay);

	return kaamakazi;
}

function spawnTurret(player, position= new Vector(), firerate= 500)
{
	const turret= new GameObject( position);
	turret.alias= "enemy";
	turret.layer= "projectile";
	turret.health= 5;
	turret.healthCap= 5;
	turret.addTimer("firerate", new Timer());
	turret.firerate= firerate;

	turret.renderer= (gameObject, damaged= false) => {
		const temp_vect= Vector.subtraction(player.position, gameObject.position);
		gameObject.shootDirection= temp_vect.getAngle();

		context.beginPath();
		context.strokeStyle= "white";
		context.fillStyle= "white";
		context.save();
		context.translate(gameObject.position.x, gameObject.position.y);
		context.rotate(gameObject.shootDirection - Math.PI / 2);
		context.arc(0, 0, gameObject.collider.radius, 0, Math.PI * 2);
		context.fill();
		context.moveTo(0, 0);
		context.fillRect(-10, 0, 20, 3 * gameObject.collider.radius / 2);
		context.restore();
	};

	turret.addCollider({
		type: "circle",
		radius: 25,
		uncolide: true,
		computeBoundryCollision: true,
		onCollision: (current, other) => {
			if(other.alias === "playerProjectile")
			{
				turret.health-= other.damage || 1;
				if(turret.health <= 0)
				{
					current.destroy();
				}
			}
		}
	});

	turret.executables.unshift(gameObject => {

		if(gameObject.timers.firerate)
		{	
			if(gameObject.timers.firerate.getDuration() > (gameObject.firerate || 250))
			{
				gameObject.timers.firerate.reset();

				const proj= new Projectile(gameObjectList, new Vector(gameObject.position.x, gameObject.position.y), 5, gameObject.shootDirection, 10);
				proj.alias= "enemyProjectile";
			}
		}
	});

	return turret;
}

function spawnChaser(player)
{
	const dir= (Math.random() * 360) * Math.PI / 180,
		a= (width / 2) * Math.cos(dir),
		b= (width / 2) * Math.sin(dir);
	const vect= new Vector(a, b);

	const chaser= new GameObject( vect, new Vector(Math.random() * 3, 0));
	chaser.alias= "enemy";
	chaser.layer= "projectile";
	chaser.health= 3;
	chaser.healthCap= 3;
	chaser.addTimer("firerate", new Timer());
	chaser.firerate= 750;

	chaser.renderer= (gameObject, damaged= false) => {

		context.beginPath();
		context.strokeStyle= "white";
		context.fillStyle= "white";
		context.save();
		context.translate(gameObject.position.x, gameObject.position.y);
		context.rotate(gameObject.velocity.getAngle() - Math.PI / 2);
		context.arc(0, 0, gameObject.collider.radius, 0, Math.PI * 2);
		context.fill();
		context.moveTo(-(gameObject.collider.radius), 0);
		context.lineTo(-(gameObject.collider.radius * 1.5), -gameObject.collider.radius * 2.5);
		context.moveTo((gameObject.collider.radius), 0);
		context.lineTo((gameObject.collider.radius * 1.5), -gameObject.collider.radius * 2.5);
		context.moveTo(0, -(gameObject.collider.radius));
		context.lineTo(0, -gameObject.collider.radius * 3);
		context.stroke();
		context.restore();
	};

	chaser.addCollider({
		type: "circle",
		radius: 25,
		uncolide: true,
		computeBoundryCollision: false,
		onCollision: (current, other) => {
			if(other.alias === "playerProjectile")
			{
				chaser.health-= other.damage || 1;
				if(chaser.health <= 0)
				{
					current.destroy();
				}
			}
		}
	});

	chaser.executables.unshift(gameObject => {
		const temp_vect= Vector.subtraction(player.position, gameObject.position);
		gameObject.shootDirection= temp_vect.getAngle();

		temp_vect.setMag(gameObject.velocity.getMag());
		gameObject.velocity= temp_vect;

		if(gameObject.timers.firerate)
		{	
			if(gameObject.timers.firerate.getDuration() > (gameObject.firerate || 250))
			{
				gameObject.timers.firerate.reset();

				const proj= new Projectile(gameObjectList, new Vector(gameObject.position.x, gameObject.position.y), 5, temp_vect.getAngle(), 7);
				proj.alias= "enemyProjectile";
			}
		}
	});

	return chaser;
}

function spawnTheDuke()
{
	let dukeCount= 0;

	const dukeSpawner= (positon= new Vector(0, 0), number= 1, size= 100, health= 10, vertices= 20) => {
		for(let i= 0; i < number; i++)
		{
			dukeCount++;

			const duke= new Asteroid(gameObjectList, positon, vertices);
			duke.velocity= getRandomVector(5, 5);
			duke.alias= "enemy";
			duke.layer= "projectile";
			duke.health= health;
			duke.healthCap= health;
			duke.executables.push(gameObject => {
				const pos= new Vector(gameObject.position.x - (gameObject.collider.radius / 2), gameObject.position.y + (gameObject.collider.radius));
				const thickness= 7;
				const colors= ["black", "white"];
				
				context.save();
				context.translate(pos.x, pos.y);
				context.beginPath();
				context.fillStyle= colors[0];
				context.fillRect(0, 0, 100, thickness);
				context.fillStyle= colors[1];
				const widthPerHP= 100 / gameObject.healthCap;
				const currentHP= gameObject.healthCap - gameObject.health;
				let health= 100 - currentHP * widthPerHP;
				context.fillRect(0, 0, health, thickness);
				context.restore();
			});
			//duke.drawGizmos= true;
			duke.addCollider({
				type: "circle",
				radius: size,
				uncolide: true,
				computeBoundryCollision: true,
				onCollision: (current, other) => {
					if(other.alias === "playerProjectile")
					{
						duke.health-= 1;
						if(duke.health <= 0)
						{
							if(size > 20)
							{
								dukeSpawner(current.position, 2, size - 20, health / 2);
							}
							dukeCount--;
							if(dukeCount <= 0)
								EventSystem.dispatchEvent("onBossDeath");
							current.destroy();
						}
					}
				}
			});
		}
	};

	dukeSpawner();
};

function spawnMrMonstro(player)
{
	const monstro= new GameObject( getRandomVector());
	monstro.alias= "enemy";
	monstro.layer= "projectile";
	monstro.health= 175;
	monstro.healthCap= 175;
	monstro.addTimer("firerate", new Timer());
	monstro.firerate= 500;
	monstro.addTimer("movementRate", new Timer())
	monstro.movementRate= 1000;
	monstro.movementTick= false;
	monstro.spread= 30;
	monstro.projectilesPerShot= 10
	monstro.phase= 1;

	monstro.executables.push(drawDossHealthBar);

	monstro.renderer= (gameObject, damaged= false) => {
		context.save();
		context.translate(gameObject.position.x, gameObject.position.y);
		context.beginPath();
		context.fillStyle= damaged ? "grey" : "white";
		context.arc(0, 0, gameObject.collider.radius, 0, Math.PI * 2);
		context.fill();
		context.restore();
	};

	monstro.addCollider({
		type: "circle",
		radius: 50,
		uncolide: true,
		computeBoundryCollision: true,
		onCollision: (current, other) => {
			if(other.alias === "playerProjectile")
			{
				monstro.health-= other.damage || 1;
				if(current.health <= current.healthCap / 2 && current.phase === 1)
				{
					current.projectilesPerShot= Math.round(current.projectilesPerShot * 1.5);
					current.spread= current.spread * 2;
					current.phase= 2;
				}
				if(monstro.health <= 0)
				{
					current.destroy();
					EventSystem.dispatchEvent("onBossDeath");
				}
			}
		}
	});

	monstro.executables.unshift(gameObject => {
		if(gameObject.timers.movementRate)
		{	
			if(gameObject.timers.movementRate.getDuration() > (gameObject.movementRate || 1000))
			{
				gameObject.timers.movementRate.reset();
				
				if(gameObject.movementTick === false)
				{
					const temp_vect= Vector.subtraction(player.position, gameObject.position);
					temp_vect.setMag(5);
					gameObject.velocity= temp_vect;
				}
				else
				{
					gameObject.velocity= new Vector();

					const temp_vect= Vector.subtraction(player.position, gameObject.position);
					gameObject.shootDirection= temp_vect.getAngle();

					if(gameObject.timers.firerate)
					{	
						if(gameObject.timers.firerate.getDuration() > (gameObject.firerate || 250))
						{
							gameObject.timers.firerate.reset();

							const offsetAng= Math.PI/gameObject.spread;

							for(let i= 0; i < gameObject.projectilesPerShot; i++)
							{
								const proj= new Projectile(gameObjectList, new Vector(gameObject.position.x, gameObject.position.y), (Math.random() * 5 + 4), (temp_vect.getAngle() + (offsetAng * i)), 10, "enemyProjectile");
							}
							if(gameObject.phase === 2)
								bulletSplosion(gameObject.position, gameObject.projectilesPerShot);
						}
					}
				}
				gameObject.movementTick= !gameObject.movementTick;
			}
		}
	});

	return monstro;
};

function bulletSplosion(position= new Vector(0, 0), numberOfProjectiles= 10, size= 10, offset= 0, speed= 7, alias= "enemyProjectile", damage= 1)
{
	let slice= (Math.PI * 2) / numberOfProjectiles, 
	angle= offset;
	for(let i= 0; i < numberOfProjectiles; i++)
	{
		new Projectile(gameObjectList, position, speed, angle, size, alias, damage);
		angle= angle + slice;
	}
};

function spawnXPloder(position= getRandomVector(), projCount= 4, size= 10, firerate= 1000)
{
	const xPloder= new GameObject( position, getRandomVector(5, 5));
	xPloder.layer= "projectile";
	xPloder.alias= "enemy";
	xPloder.type= "xPloder";
	xPloder.projectileCount= projCount;
	xPloder.health= 5;
	xPloder.healthCap= 5;
	xPloder.addTimer("firerate", new Timer());
	xPloder.firerate= firerate;
	xPloder.renderer= circleRenderer;

	xPloder.addCollider({
		type: "circle",
		radius: 30,
		uncolide: true,
		computeBoundryCollision: true,
		onCollision: (current, other) => {
			if(other.alias === "playerProjectile")
			{
				current.health-= other.damage || 1;
				if(current.health <= 0)
				{
					current.destroy();
				}
			}
		}
	});

	xPloder.executables.unshift(gameObject => {

		if(gameObject.timers.firerate)
		{	
			if(gameObject.timers.firerate.getDuration() > (gameObject.firerate || 1000))
			{
				gameObject.timers.firerate.reset();
				bulletSplosion(xPloder.position, xPloder.projectileCount, size);
			}
		}
	});

	return xPloder;
};

function playerMovementSnappy(player)
{
	if(Input.w === true)
	{
		player.velocity.setMag(5);
		if(Input.d === true)
		{
			player.velocity.setAngle(Math.PI / 4);
		}
		else if(Input.a === true)
		{
			player.velocity.setAngle( 3 * (Math.PI / 4));
		}
		else
		{
			player.velocity.setAngle(Math.PI / 2);
		}
	}
	else if(Input.s === true)
	{
		player.velocity.setMag(5);
		if(Input.d === true)
		{
			player.velocity.setAngle(-Math.PI / 4);
		}
		else if(Input.a === true)
		{
			player.velocity.setAngle(-3 * (Math.PI / 4));
		}
		else
		{
			player.velocity.setAngle(-Math.PI / 2);
		}
	}
	else
	{
		player.velocity.setMag(5);
		if(Input.d === true)
		{
			player.velocity.setAngle(0);
		}
		else if(Input.a === true)
		{
			player.velocity.setAngle(Math.PI);
		}
	}

	if(!Input.w && !Input.s && !Input.a && !Input.d)
	{
		player.velocity.setMag(0);
		player.velocity= player.velocity.multiply(0.5);
	}

	player.shootDirection= player.shootDirection || Math.PI / 2;

	if(Input.up === true)
	{
		if(Input.right === true)
		{
			player.shootDirection= Math.PI / 4;
		}
		else if(Input.left === true)
		{
			player.shootDirection=  3 * (Math.PI / 4);
		}
		else
		{
			player.shootDirection= Math.PI / 2;
		}
	}
	else if(Input.down === true)
	{
		if(Input.right === true)
		{
			player.shootDirection= -Math.PI / 4;
		}
		else if(Input.left === true)
		{
			player.shootDirection= -3 * (Math.PI / 4);
		}
		else
		{
			player.shootDirection= -Math.PI / 2;
		}
	}
	else
	{
		if(Input.right === true)
		{
			player.shootDirection= 0;
		}
		else if(Input.left === true)
		{
			player.shootDirection= Math.PI;
		}
	}

	if(!Input.up && !Input.down && !Input.left && !Input.right)
	{
		player.shootDirection= Math.PI / 2;
	}

	if(Input.up || Input.down || Input.left || Input.right)
	{
		if(player.timers.firerate)
		{	
			if(player.timers.firerate.getDuration() > (player.firerate || 250))
			{
				player.timers.firerate.reset();

				const proj= new Projectile(new Vector(player.position.x, player.position.y), 10, player.shootDirection);
				proj.alias= "playerProjectile";
				proj.damage= player.damage;
			}
		}
	}

	if(Input.space === true)
	{
		if(player.timers.superrate.getDuration() >= player.superrate)
		{
			bulletSplosion(player.position, 20, 10, 0, 7, "playerProjectile", player.damage * 2);
			player.timers.superrate.reset();
		}
	}

};

function drawDossHealthBar(gameObject, position= new Vector(0, height - 50), barWidth= (width - 200), colors= ["black", "white"])
{
	context.save();
	context.translate(position.x, position.y);
	context.beginPath();
	context.fillStyle= colors[0];
	context.fillRect(-barWidth / 2, -height / 2, barWidth, 20);
	context.fillStyle= colors[1];

	const widthPerHP= barWidth / gameObject.healthCap;
	const currentHP= gameObject.healthCap - gameObject.health;
	let health= barWidth - currentHP * widthPerHP;

	context.fillRect(-barWidth / 2, -height / 2, health, 20);
	context.restore();
};

function drawRouteIntro(route= "index.html")
{
	const UI= new UIObject(gameObjectList, new Vector(), gameObject => {
		const text= "https://google.com/" + route;
		context.save();
		context.transform(1, 0, 0, -1, 0, 0)
		context.fillStyle= "white";
		context.font = "50px sans";
		context.fillText(text, -context.measureText(text).width / 2, 0);
		context.font = "80px sans";
		if(gameObject.triggerTransition)
		{
			context.fillStyle= "red";
			context.fillText("404", -context.measureText("404").width / 2, 90);
		}
		context.restore();
	});
	UI.triggerTransition= false;
	UI.onDestroy= () => {
		EventSystem.dispatchEvent("onIntroComplete");
	};
	TimeOut.newTimeOut(() => {
		UI.triggerTransition= true;
		UI.destroy(2000);
	}, 2000);

};

function drawRouteOutro(route= "index.html")
{
	const UI= new UIObject(gameObjectList, new Vector(), gameObject => {
		const text= "https://google.com/" + route;
		context.save();
		context.transform(1, 0, 0, -1, 0, 0)
		context.fillStyle= "white";
		context.font = "50px sans";
		context.fillText(text, -context.measureText(text).width / 2, 0);
		context.font = "80px sans";
		if(gameObject.triggerTransition)
		{
			context.fillStyle= "green";
			context.fillText("200", -context.measureText("200").width / 2, 90);
		}
		else
		{
			context.fillStyle= "red";
			context.fillText("404", -context.measureText("404").width / 2, 90);
		}
		context.restore();
	});
	UI.triggerTransition= false;
	UI.onDestroy= () => {
		EventSystem.dispatchEvent("onOutroComplete");
	};
	TimeOut.newTimeOut(() => {
		UI.triggerTransition= true;
		UI.destroy(2000);
	}, 2000);

};

function spawnExit()
{
	const exit= new GameObject( new Vector(0, height / 2));
	exit.layer= "projectile";
	exit.addCollider({
		type: "circle",
		radius: 50,
		uncolide: false,
		computeBoundryCollision: false,
		onCollision: (current, other) => {
			if(other.alias === "player")
			{
				current.destroy();
				//other.destroy();
				EventSystem.dispatchEvent("onLevelExit");
			}
		}
	});

	exit.renderer= (gameObject) => {
		context.save();
		context.translate(gameObject.position.x, gameObject.position.y);
		context.beginPath();
		context.fillStyle= getRandomColor();
		context.arc(0, 0, gameObject.collider.radius, 0, Math.PI * 2);
		context.fill();
		context.restore();
	};

	return exit;
}

function startLevel1(player)
{
	const level1= new GameObject(gameObjectList);
	level1.alias= "level";
	level1.enemyCount= 0;
	level1.spawningComplete= false;
	level1.executables.push((gameObject) => {
		nurdyStats3.innerHTML= level1.enemyCount;
		if(gameObject.spawningComplete && gameObject.enemyCount <= 0)
		{
			gameObject.destroy();
			TimeOut.newTimeOut(() => {
				spawnMrMonstro(player);
			}, 2000);
		}

	});

	let enemy= spawnTurret(player, new Vector(width / 3, height / 3));
		enemy.onDestroy= () => level1.enemyCount--;
	enemy= spawnTurret(player, new Vector(-width / 3, height / 3));
		enemy.onDestroy= () => level1.enemyCount--;
	enemy= spawnTurret(player, new Vector(width / 3, -height / 3));
		enemy.onDestroy= () => level1.enemyCount--;
	enemy= spawnTurret(player, new Vector(-width / 3, -height / 3));
		enemy.onDestroy= () => level1.enemyCount--;

	level1.enemyCount= 4;

	Interval.newInterval(() => {
		enemy=spawnChaser(player);
			enemy.onDestroy= () => level1.enemyCount--;
		enemy=spawnChaser(player);
			enemy.onDestroy= () => level1.enemyCount--;
		
		level1.enemyCount+= 2;
	}, 3000, 3, () => {
		console.log("spawn complete");
		level1.spawningComplete= true;
	});
};


function startLevel2(player)
{
	const level2= new GameObject(gameObjectList);
	level2.alias= "level";
	level2.enemyCount= 0;
	level2.spawningComplete= 0;
	level2.executables.push((gameObject) => {
		nurdyStats3.innerHTML= level2.enemyCount;
		if(gameObject.spawningComplete === 2 && gameObject.enemyCount <= 0)
		{
			gameObject.destroy();
			TimeOut.newTimeOut(() => {
				spawnTheHive(player);
			}, 2000);
		}

	});

	const spacing= 75;

	let enemy= spawnTurret(player, new Vector(0, spacing));
		enemy.onDestroy= () => level2.enemyCount--;
	enemy= spawnTurret(player, new Vector(0, -spacing));
		enemy.onDestroy= () => level2.enemyCount--;
	enemy= spawnTurret(player, new Vector(spacing, 0));
		enemy.onDestroy= () => level2.enemyCount--;
	enemy= spawnTurret(player, new Vector(-spacing, 0));
		enemy.onDestroy= () => level2.enemyCount--;

	level2.enemyCount= 4;

	Interval.newInterval(() => {
		let slice= (Math.PI * 2) / 10, 
		angle= 0;
		for(let i= 0; i < 10; i++)
		{
			const vel= new Vector(0, 0);
			vel.setMag(5);
			vel.setAngle(angle);

			const enemy= spawnKaamakazi(player, new Vector(), vel);
			enemy.onDestroy= () => level2.enemyCount--;
			angle= angle + slice;

			level2.enemyCount+= 1;
		}
		
	}, 3000, 5, () => {
		console.log("spawn complete");
		level2.spawningComplete++;
	});

	Interval.newInterval(() => {
		enemy=spawnChaser(player);
			enemy.onDestroy= () => level2.enemyCount--;
		
		level2.enemyCount+= 1;
	}, 1000, 10, () => {
		console.log("spawn complete");
		level2.spawningComplete++;
	});
};

function startLevel3(player)
{
	const level3= new GameObject(gameObjectList);
	level3.alias= "level";
	level3.enemyCount= 0;
	level3.spawningComplete= 0;
	level3.executables.push((gameObject) => {
		nurdyStats3.innerHTML= level3.enemyCount;
		if(gameObject.spawningComplete && gameObject.enemyCount <= 0)
		{
			gameObject.destroy();
			TimeOut.newTimeOut(() => {
				spawnDrFatal(player);
			}, 2000);
		}

	});

	let enemy= spawnTurret(player, new Vector(0, height / 2.5), 1000);
		enemy.onDestroy= () => level3.enemyCount--;
	enemy= spawnTurret(player, new Vector(width / 2.5, height / 2.5), 1000);
		enemy.onDestroy= () => level3.enemyCount--;
	enemy= spawnTurret(player, new Vector(-width / 2.5, height / 2.5), 1000);
		enemy.onDestroy= () => level3.enemyCount--;
	enemy= spawnTurret(player, new Vector(0, -height / 2.5), 1000);
		enemy.onDestroy= () => level3.enemyCount--;
	enemy= spawnTurret(player, new Vector(width / 2.5, -height / 2.5), 1000);
		enemy.onDestroy= () => level3.enemyCount--;
	enemy= spawnTurret(player, new Vector(-width / 2.5, -height / 2.5), 1000);
		enemy.onDestroy= () => level3.enemyCount--;

	level3.enemyCount= 6;

	Interval.newInterval(() => {
		/*let slice= (Math.PI * 2) / 3, 
		angle= 0;
		for(let i= 0; i < 3; i++)
		{
			const vel= new Vector(0, 0);
			vel.setMag(5);
			vel.setAngle(angle);

			const enemy= spawnKaamakazi(player, new Vector(), vel);
			enemy.onDestroy= () => level3.enemyCount--;
			angle= angle + slice;

			level3.enemyCount+= 1;
		}*/
		
	}, 3000, 5, () => {
		console.log("spawn complete");
		level3.spawningComplete++;
	});

	Interval.newInterval(() => {
		const enemy= spawnXPloder(getRandomVector(), 4, 10);
			enemy.onDestroy= () => level3.enemyCount--;
		
		level3.enemyCount+= 1;
	}, 1000, 5, () => {
		console.log("spawn complete");
		level3.spawningComplete++;
	});
};

function playerDeathScene()
{
	gameObjectList.length= 0;
	Interval.intervalArray= [];
	TimeOut.TimeOutArray= [];

	if(lives <= 0)
	{
		new UIObject(gameObjectList, new Vector(), gameObject => {
			const text= "GAME OVER!!!";
			context.save();
			context.transform(1, 0, 0, -1, 0, 0)
			context.fillStyle= "white";
			context.strokeStyle= "white";
			context.font = "80px sans";
			context.fillText(text, -context.measureText(text).width / 2, 0);
			context.restore();
		});
		return;
	}

	const UI= new UIObject(gameObjectList, new Vector(), gameObject => {
		let pos= new Vector(-150, 0);

		for(let i= 0; i < lives; i++)
		{
			context.save();
			context.translate(pos.x, pos.y);
			context.beginPath();
			context.fillStyle= "red";
			context.arc(0, 0, 25, 0, Math.PI * 2);
			context.arc(40, 0, 25, 0, Math.PI * 2);
			context.fill();

			context.rotate(Math.PI / 4);
			context.fillRect(-25, -53, 50, 50);
			context.restore();

			pos.x= pos.x + 150;
		}
	});
	UI.triggerTransition= false;
	UI.onDestroy= () => {
		EventSystem.dispatchEvent("onLevelRestart");
	};
	TimeOut.newTimeOut(() => {
		lives--;
		TimeOut.newTimeOut(() => {
			UI.destroy(1000);
		}, 2000);
	}, 2000);

};

function tutorialScreen()
{
	const UI= new UIObject(gameObjectList, new Vector(), gameObject => {
		context.save();
		context.transform(1, 0, 0, -1, 0, 0);
		context.fillStyle= "white";
		context.strokeStyle= "white";
		context.font = "30px sans";

		context.beginPath();
		context.translate(-(width / 3), -100);
		context.fillText("Movement", 0, 0);

		context.beginPath();
		context.translate(0, 50);
		context.fillText("W  : Up", 0, 0);

		context.beginPath();
		context.translate(0, 50);
		context.fillText("S  : Down", 0, 0);

		context.beginPath();
		context.translate(0, 50);
		context.fillText("A  : Left", 0, 0);
		
		context.beginPath();
		context.translate(0, 50);
		context.fillText("D  : Right", 0, 0);

		context.restore();

		context.save();
		context.transform(1, 0, 0, -1, 0, 0);
		context.fillStyle= "white";
		context.strokeStyle= "white";
		context.font = "30px sans";

		context.beginPath();
		context.translate((width / 5), -100);
		context.fillText("Shoot", 0, 0);

		context.beginPath();
		context.translate(0, 50);
		context.fillText("↑  : Up", 0, 0);

		context.beginPath();
		context.translate(0, 50);
		context.fillText("↓  : Down", 0, 0);

		context.beginPath();
		context.translate(0, 50);
		context.fillText("←  : Left", 0, 0);
		
		context.beginPath();
		context.translate(0, 50);
		context.fillText("→  : Right", 0, 0);

		context.restore();

		context.save();
		context.transform(1, 0, 0, -1, 0, 0);
		context.fillStyle= "white";
		context.strokeStyle= "white";
		context.font = "30px sans";

		context.beginPath();
		context.translate(0, 0);
		context.fillText("Space : Super", -context.measureText("Space. : Super").width / 2, 0);

		context.beginPath();
		context.translate(0, -(height / 2) + 100);
		context.fillText("Exit", -context.measureText("Exit").width / 2, 0);

		context.restore();
	});

	const exit= spawnExit();
	exit.collider.onCollision= (current, other) => {
		if(other.alias === "player")
		{
			current.destroy();
			UI.destroy();
			other.positon= new Vector(0, 0);
			EventSystem.dispatchEvent("onTutorialComplete");
		}
	}
}

