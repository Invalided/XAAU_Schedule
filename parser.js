function scheduleHtmlParser(html) {
	//除函数名外都可编辑
	//传入的参数为上一步函数获取到的html
	//可使用正则匹配
	//可使用解析dom匹配，工具内置了$，跟jquery使用方法一样，直接用就可以了，参考：https://juejin.im/post/5ea131f76fb9a03c8122d6b9
	//以下为示例，您可以完全重写或在此基础上更改
	let result = []
	$('tbody tr').each(function(i) { // 遍历 tr
		$(this).find('td').each(function(j) { // 遍历 tr 的各个 td
			let source = $(this).text();
			//21.3.13 新增判断日期与数据数据是否一致 默认去除周六周天课程
			//eq(index)使用index选择元素
			let daySource = getDay($('th').eq(j).text().trim().replace('星期',''));
			if(daySource == -1){
				//在ecah中等同于continue
				return true;
			}
			
			if (j > 0 && source.length != 0) {
				let re = {
					name: "",
					position: "",
					day: "",
					teacher: "",
					sections: [],
					weeks: []
				}
				
				let data;
				if(source.indexOf(") (")!=-1){
					//情况一
					data = (source.replaceAll(') (', ')++(')).replaceAll(')(', ')++(').split('++');
				}else{
					//情况二
					data = (source.replaceAll(')(', ')++(').replaceAll('(', '++(')).split('++');
				}
				for (let x = 3; x <= data.length; x++) {
					let name = data[0];
					let teacher = data[1].replace('(', '').replace(')', '');
					//处理重复数据
					let index = data[2].indexOf(name);
					//删除重复的课程名
					let week = [];
					if (index != -1) {
						data[2] = data[2].replace(name, '');
					}
					//处理课程名信息
					name = name.replace(/[^\u4e00-\u9fa5]/gi,"");
					//删除重复的教师名
					for (let i = 3; i < data.length; i++) {
						if (data[1] == data[i]) {
							data.splice(i, 1);
						}
					}
					//处理周对应的数据
					let weekAndPosition = (data[x - 1].replace('(', '').replace(')', '')).split(',');
					let posIndex = (weekAndPosition + "").indexOf(',');
					let position = (weekAndPosition + "").substring(posIndex + 1);
					let weeksData = (weekAndPosition[0]).split(' ');
					//week获取 单双周
					for (let i = 0; i < weeksData.length; i++) {
						let temp = weeksData[i];
						let str = temp.replace('单', '').replace('双', '').split('-');
						let addition = 1;
						if (temp.indexOf('单') != -1 || temp.indexOf('双') != -1) {
							addition = 2;
						} else if (temp.length == 1) {
							week.push(parseInt(temp));
						}
						let begin = parseInt(str[0]);
						let end = parseInt(str[1]);
						for (; begin <= end;) {
							week.push(begin);
							begin += addition;
						}
					}
					let section = [];
					section.push({
						"section": i + 1
					});
					section.push({
						"section": i + 2
					});
					re.name = name;
					re.position = position;
					re.day = daySource;
					re.sections = section;
					re.teacher = teacher;
					re.weeks = week;
				}
				result.push(re);
			}
		});
	});

	function getDay(daySource){
		switch(daySource){
			case '一':
				daySource = 1;
				break;
			case '二':
				daySource = 2;
				break;
			case '三':
				daySource = 3;
				break;
			case '四':
				daySource = 4;
				break;
			case '五':
				daySource = 5;
				break;
			default:
				daySource = -1;
				break;
		}
		return daySource;
	}
	
	
	
	let sectionTimes = [{
		"section": 1,
		"startTime": "08:00",
		"endTime": "08:50"
	}, {
		"section": 2,
		"startTime": "09:00",
		"endTime": "09:50"
	}, {
		"section": 3,
		"startTime": "10:10",
		"endTime": "11:00"
	}, {
		"section": 4,
		"startTime": "11:10",
		"endTime": "12:00"
	}, {
		"section": 5,
		"startTime": "13:00",
		"endTime": "13:50"
	}, {
		"section": 6,
		"startTime": "14:00",
		"endTime": "14:50"
	}, {
		"section": 7,
		"startTime": "15:10",
		"endTime": "16:00"
	}, {
		"section": 8,
		"startTime": "16:10",
		"endTime": "17:00"
	}, {
		"section": 9,
		"startTime": "17:10",
		"endTime": "18:00"
	}, {
		"section": 10,
		"startTime": "19:00",
		"endTime": "19:50"
	}, {
		"section": 11,
		"startTime": "20:00",
		"endTime": "20:50"
	}, ];
	console.info(result);

	return {
		courseInfos: result,
		setctionTimes: sectionTimes
	}
}