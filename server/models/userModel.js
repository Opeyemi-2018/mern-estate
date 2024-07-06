import mongoose from "mongoose";

let userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: {
        type: String,
        default: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJcAAACUCAMAAACp1UvlAAAAMFBMVEXk5ueutLersbTo6erh4+S1ur3O0dO5vsHe4OLR1NbU19nEyMqorrLb3t/Hy82xt7oCU+LkAAADjklEQVR4nO2bzXbrIAyEDQJjAzbv/7YX7CS3buMYhCWyYBY9/dl8ZxASgekwdHV1dXV1dXV1dXV1dXV1dXURCgDUEqXSd61hHoJBWaeD2BXMOKXftRYMo5FeipeklHpdGrsGygXxA+rJJoxt6BkM7g3UTuaNbQUGNpxQ7evpVBuy1Z9TbWRhaQCm9AeznmQjO9gSLqmiPDfYlEOVHFtZwaYst/gdy8aKjs1sYGCuS/4H2MQEBmMJlhCGCUtd9K0/hjkWw8pWcQNbOLjmUqy4kgyGgSnGEoJ+hoMtrK4kSV/6KLuEn6i5FgwWw5Zcy6s+KShiLo3CEoJ4GpX21KfkSopVOoL+S9NyoXbjZhhpgQG2vIS3lFz558E/fpGeD3HdaxNlBwOL56Kc3TDjuTQlF7pNxI7fub6H61vrq4KLdD9W9AnSE1hFv6e9qEBz0c7Hrz1PII/RsU1QYsXBjT2vOlquAWkX+Y2mQy4k8RUFsoNJ+hsKVKfw5BcUMGIqn/bT0C4ElhwZuBBnHQ67EBVGX11JUNpbme5XByjtYeSXX0+V3d+zPUTCVMDFtYobWH7XJx/YR7A5s/YZBtARzGYtJa9bD7BrMs9YWy+w6XpX8j8jD1tK4WORSd0qqQDT+du7DLwvyEewweq3nknpuF5Dz9AWE+RhC8QfzNo+1QQw2dVI733Ei1+DGVunhp6CIcW/5nGc7fQFEauX4Jfa8wxKTXZenTFahyRtnEu2qe2vTZhgikA6SP+77JNC5JsXZu+iTctq9q133lYTbtwDiqviQI1OZwzHB512M30OLGUcjTgLyZ2gCWEsqWsA9jS491k+OLKmloYOjmpzLY5xCs9gmN+PwgI0M95NFqk+ZRyzycJ8KxnY4kzOGdmN8VFQ6Nvet2Q3nYBgxFf7W7BbMgvRrFupNjJTXWXxE+ztWKn+K6sM1vuhdrKqj0pwFTWuAKv4IF6e2CsCw2IRVPwBTCOrPyOYXQdmUG9ZtG7tYOWGkdbWC6z4uodwJx7ByhyrecguAytrsIoJS5RdVrMU166i2q+IlRTLF5wu+KhEQYQU/7iOUnayAh/eQILlGcZsV34T46USmRUGiNx/pbIOifioC54r5yiW9w9e98pfL2SDZUz/+3TtFzZQUqWMYYROQNcoIxTZwi4RLuM72CBVpa6OYdkPsffqsoPF87NsIH85u3+/XXDpqr66urq6uroY9Q/jASt2DGsuNgAAAABJRU5ErkJggg=="
    }
}, {timestamps: true})

let User = mongoose.model('User', userSchema)
export default User;