import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

// biến được lưu trong bộ nhớ cache có ý định giữ một kết nối được lưu trong bộ nhớ cache cơ sở dữ liệu
let cached = (global as any).mongoose || { conn: null, promise: null }

export const connectToDatabase = async () => {

    // kiểm tra nếu cache đã được kết nối hay chưa
    if (cached.conn) return cached.conn


    if (!MONGODB_URI) throw new Error('MONGODB_URI is missing!')

    // ! lưu ý: Code bên dưới chỉ chạy cho lần đầu tiên hoặc cache kết nối ko còn đc lưu trữ !

    // nếu chưa có cache ( tức chưa lưu kết nối )
    // sẽ tạo một kết nối mới, sau đó kết nối sẽ được lưu trữ lại trong cache
    // lần tiếp theo sẽ kiểm tra cache, vì lúc này cache đã lưu trữ kết nối nên sẽ
    // không tạo thêm kết nối nữa => tăng hiệu suất
    cached.promise = cached.promise || mongoose.connect(MONGODB_URI, {
        dbName: 'evently',
        bufferCommands: false
    })

    cached.conn = await cached.promise

    return cached.conn;
}