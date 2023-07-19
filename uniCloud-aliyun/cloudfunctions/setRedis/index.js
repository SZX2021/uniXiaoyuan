'use strict';
const redis = uniCloud.redis();
exports.main = async (event, context) => {
	listItems = ['全部', '日常', '吐槽', '集市', '失物招领'];
	for(item in listItems){
		uniCloud.callFunction({
		name: 'getArticle',
		data: {
			category,
			skipcount,
			limitcount: state.limitcount,
		}
	}
	
	
	//返回数据给客户端
	return event
};
