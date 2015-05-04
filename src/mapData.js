MapData = {};

MapData.Map = {
	width: 600,
	height: 400
};

MapData.Levels = [
	{
		elevators: [
			{top: 350, left: 0, height: 50, width: 50}
		],
		blocks: [
			{top: 200, left: 100, height: 50, width: 50},
			{top: 250, left: 150, height: 50, width: 100},
			{top: 250, left: 275, height: 50, width: 50},
			{top: 350, left: 450, height: 50, width: 50}
		],
		man: {
			initialPos: {
				top: 0,
				left: 100
			}
		}
	}
];

module.exports = MapData;