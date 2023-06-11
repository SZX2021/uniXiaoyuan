'use strict';

const { pipeline } = require("stream");

exports.main = async (event, context) => {
	const dbJQL = uniCloud.databaseForJQL({
		event,
		context
	});

	const resultTemp = await dbJQL.collection('article','user').orderBy('_id desc').get();
	const resultList = resultTemp.data.map((item) => {
	  // 将原始元素中author_id字段内容，提取到一级字段中作为author_info字段
	  const [author_info] = item.author_id;
	  const { author_id:author_id0, ...key} = item;
	  return { author_info, ...key };
	});
	// const resultList = await dbJQL.collection('article').aggregate().lookup({
	// 	from: 'comment',
	// 	localField: '_id',
	// 	foreignField: 'article_id',
	// 	as: 'comments'
	// }).lookup({
	// 	from: 'user',
	// 	localField: 'author_id',
	// 	foreignField: '_id',
	// 	as: 'author_info'
	// }).end();
	
// const resultList = await dbJQL.collection('article').aggregate([
//   {
// 	  $sort: {
// 		  _id: -1
// 	  }
//   },
//   {
//     $lookup: {
//       from: 'comment',
//       let: {
//         article_id: '$_id'
//       },
//       pipeline: [
//         {
//           $match: {
//             $expr: {
//               $eq: ['$article_id', '$$article_id']
//             }
//           }
//         }
//       ],
//       as: 'comments'
//     }
//   },
//   {
//     $lookup: {
//       from: 'user',
//       let: {
//         author_id: '$author_id'
//       },
//       pipeline: [
//         {
//           $match: {
//             $expr: {
//               $eq: ['$_id', '$$author_id']
//             }
//           }
//         }
//       ],
//       as: 'author_info'
//     }
//   }
// ]).end();
	  
	
// db.collection('article')
//         .aggregate().lookup({  
//             from: 'comment',  
//             let: {  
//                 _id: '$_id'  
//             },  
//             pipeline: $.pipeline()  
//                 .lookup({
// 					from: 'comment',
// 					localField: '_id',
// 					foreignField: 'article_id',
// 					as: 'comments'
// 				}) 
//                 .done(),  
//             as: '某某'  
//         }).lookup({  
//             from: '表名1',  
//             let: {  
//                 某某1_id: '$某某1_id'  
//             },  
//             pipeline: $.pipeline()  
//                 .match(dbCmd.expr(  
//                     $.eq(['$_id', '$$某某1_id'])  
//                 ))  
//                 .done(),  
//             as: '某某1'  
//         }).end()
	//返回数据给客户端
	return resultList
};
//有数据表‘article’,‘comment’,‘comment_reply’,‘user’，'like'，uniapp云函数中，
//使用jql查询，表article中字段_id为表comment中article_id和表like中article_id的外键，
//表comment中_id为comment_reply中comment_id的外键，表user中的_id为表article、comment、comment_reply、like中
//字段user_id的外键，如何以article为主表进行联表查询