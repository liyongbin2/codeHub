const connection = require('../app/database');

// const sqlFragment = `
//   SELECT 
//     m.id id, m.content content, m.createAt createTime, m.updateAt updateTime,
//     JSON_OBJECT('id', u.id, 'name', u.name) author
//   FROM moment m
//   LEFT JOIN user u ON m.user_id = u.id
// `

class MomentService {
  async create (userId, content) {
    const statement = `INSERT INTO moment (content, user_id) VALUES (?, ?);`;
    const [result] = await connection.execute(statement, [content, userId]);
    return result;
  }

  async getMomentById (id) {
    const statement = `
       SELECT
	        m.id id,
	        m.content content,
	        m.createAt createTime,
	        m.updateAt updateTime,
	        JSON_OBJECT( 'id', u.id, 'name', u.NAME, 'avatar', u.avatar_url ) author,# 子查询
	        ( SELECT COUNT(*) FROM COMMENT c WHERE c.moment_id = m.id ) commentCount,# 子查询
	        (
	        SELECT
	        IF
		        (
		        	COUNT( c.id ),
		        	JSON_ARRAYAGG(
		        		JSON_OBJECT(
		        			'id', c.id,
		        			'content', c.content,
		        			'createTime', c.createAt,
		        			'updateTime', c.updateAt,
		        			'user', JSON_OBJECT( 'id', cu.id, 'name', cu.name, 'avatar', cu.avatar_url ) 
		        		) 
		        	),
		        NULL 
		        ) 
	        FROM
		      COMMENT c
		      LEFT JOIN users cu ON cu.id = c.user_id # 使条件和最终的传入的条件联系起来
        	WHERE
        		m.id = c.moment_id 
        	) comments,
        	# 子查询，这里主要使用了sql的字符串拼接
          ( SELECT JSON_ARRAYAGG( CONCAT( 'http://localhost:3000/moment/images/', file.filename ) ) FROM file WHERE file.moment_id = m.id ) images,
          IF
	          ( COUNT( l.id ), JSON_ARRAYAGG( JSON_OBJECT( 'id', l.id, 'name', l.NAME ) ), NULL ) labels 
            FROM moment m
          LEFT JOIN users u ON m.user_id = u.id
          LEFT JOIN moment_label ml ON ml.moment_id = m.id
          LEFT JOIN label l ON l.id = ml.label_id 
          WHERE
            m.id = ? 
          #这里需要分组，不然会报错
          GROUP BY m.id 
    `;
    try {
      const [result] = await connection.execute(statement, [id]);
      return result[0];
    } catch (error) {
      console.log(error)
    }
  }

  async getMomentList (offset, size) {
    const statement = `
    SELECT 
        m.id id, m.content content, m.createAt createTime, m.updateAt updateTime,
        JSON_OBJECT('id', u.id, 'name', u.name) author,
    (SELECT COUNT(*) FROM comment c WHERE c.moment_id = m.id) commentCount,
    (SELECT COUNT(*) FROM moment_label ml WHERE ml.moment_id = m.id) labelCount,
    (SELECT JSON_ARRAYAGG( CONCAT( 'http://localhost:3000/moment/images/', file.filename ) ) FROM file WHERE file.moment_id = m.id ) images
     FROM moment m
     LEFT JOIN users u ON m.user_id = u.id
    LIMIT ?,?;
    `;

    const [result] = await connection.execute(statement, [offset, size]);
    return result;
  }

  async update (content, momentId) {
    const statement = `UPDATE moment SET content = ? WHERE id = ?;`;
    const [result] = await connection.execute(statement, [content, momentId]);
    return result;
  }

  async remove (momentId) {
    const statement = `DELETE FROM moment WHERE id = ?`;
    const [result] = await connection.execute(statement, [momentId]);
    return result;
  }

  async hasLabel (momentId, labelId) {
    const statement = `SELECT * FROM moment_label WHERE moment_id = ? AND label_id = ?`;
    const [result] = await connection.execute(statement, [momentId, labelId]);
    return result[0] ? true : false;
  }

  async addLabel (momentId, labelId) {
    const statement = `INSERT INTO moment_label (moment_id, label_id) VALUES (?, ?);`;
    const [result] = await connection.execute(statement, [momentId, labelId]);
    return result;
  }
}

module.exports = new MomentService();

