const Lecture = require('../models/lectures');

exports.searchLecture = async (req, res) => {
    try {
        const {keyword, year, semester} = req.query;

        if (!keyword) {
            return res.status(400).json({message: '검색어를 입력해주세요'});
        }

        const queryConditions = [{
            $or: [
                { lectName: { $regex: keyword, $options: 'i' } },
                { lectCode: { $regex: keyword, $options: 'i' } },
                { lectProf: { $regex: keyword, $options: 'i' } }
            ]
        }];

        if (year) {
            queryConditions.push({ lectYear: parseInt(year) });
        }
         if (semester) {
            queryConditions.push({ lectSemester: semester });
        }

        const finalQuery = { $and: queryConditions };

        const lectures = await Lecture.find(finalQuery);

        if (lectures.length === 0) {
            return res.status(200).json({ message: '검색된 강의가 없습니다.' });
        }


        res.status(200).json(lectures);
    } catch {
        console.error('강의 검색 중 오류 발생:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
}