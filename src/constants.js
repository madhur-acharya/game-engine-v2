import {ImageLoader} from "./utilityFunctions.js";

const ImageLibrary= new ImageLoader();
export const bulkLoadImages= obj => {
	return ImageLibrary.bulkLoad(obj);
};

export const getImages= () => {
	return ImageLibrary.images;
};