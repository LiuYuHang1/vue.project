const axios = require("axios").default;
const fs = require("fs");

/**
 * 为小程序云开发生成可以导入的数据
 *  JSON 数据不是数组，而是类似 JSON Lines，即各个记录对象之间使用 \n 分隔，而非逗号；
 */
function writeDataForWXYunDev() {
  axios
    .get(
      "https://o2api.jd.com/data?body=%7B%22query%22%3A%22query%20getCommodities(%24ids%3A%20String)%7Bcommodities(ids%3A%20%24ids)%7BgroupId%2C%20groupName%2C%20productList%7BcanSell%20skuId%20name%20image%20commentCount%20goodRate%20jdPrice%20pcpPrice%20plusPrice%20tag%20copyWriting%20copyWritingDown%20backUpWords%7D%7D%7D%22%2C%22operationName%22%3A%22getCommodities%22%2C%22variables%22%3A%7B%22ids%22%3A%22%5B03504985%2C03505081%5D%22%7D%2C%22config%22%3A%7B%22cache%22%3Afalse%2C%22trim%22%3Atrue%2C%22map%22%3A%7B%22keyBy%22%3A%22groupId%22%2C%22valueField%22%3A%22productList%22%7D%7D%7D&_=1568689310891",
      {}
    )
    .then((res) => {
      console.log(res.data.data["03504985"]);
      let products = [];
      res.data.data["03504985"].forEach((p) => {
        var temP = {};
        temP._id = Math.floor(Date.now() * Math.random() * 10000).toString();
        temP.name = p.name;
        temP.descriptions = p.name;
        temP.price = p.jdPrice * 1;
        temP.coverImg = p.image;
        products.push(JSON.stringify(temP));
      });
      //   console.log(products);
      // console.log("插入成功");
      fs.writeFileSync("./jd.json", products.join("\n"));
    });
}

const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    descriptions: {
      type: String
    },
    onSale: {
      type: Boolean,
      default: false
    },
    content: {
      type: String,
      default: ""
    },
    quantity: {
      type: Number,
      default: 10
    },
    price: {
      type: Number,
      default: 0.0
    },
    coverImg: {
      type: String
    },
    productCategory: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "ProductCategory"
    }
  },
  {
    timestamps: true
  }
);

const Product = mongoose.model("Product", productSchema);

mongoose.connect("mongodb://localhost:27017/cat-shop").then((res) => {
  console.log(res);
  Product.find({})
    .sort({ _id: -1 })
    .then((res) => console.log(res));

  var products = [];
  axios
    .get(
      "https://o2api.jd.com/data?body=%7B%22query%22%3A%22query%20getCommodities(%24ids%3A%20String)%7Bcommodities(ids%3A%20%24ids)%7BgroupId%2C%20groupName%2C%20productList%7BcanSell%20skuId%20name%20image%20commentCount%20goodRate%20jdPrice%20pcpPrice%20plusPrice%20tag%20copyWriting%20copyWritingDown%20backUpWords%7D%7D%7D%22%2C%22operationName%22%3A%22getCommodities%22%2C%22variables%22%3A%7B%22ids%22%3A%22%5B03504985%2C03505081%5D%22%7D%2C%22config%22%3A%7B%22cache%22%3Afalse%2C%22trim%22%3Atrue%2C%22map%22%3A%7B%22keyBy%22%3A%22groupId%22%2C%22valueField%22%3A%22productList%22%7D%7D%7D&_=1568689310891",
      {}
    )
    .then((res) => {
      console.log(res.data.data["03504985"]);
      var temP = {};
      res.data.data["03504985"].forEach((p) => {
        temP.name = p.name;
        temP.descriptions = p.name;
        temP.price = p.jdPrice * 1;
        temP.coverImg = p.image;
        // products.push(temP);
        // var total = [];
      });
      var teo = [
        {
          coverImg:
            "https://g-search1.alicdn.com/img/bao/uploaded/i4/i4/1860270913/O1CN01EnJ11r1IcCHNLTbkT_!!0-item_pic.jpg_580x580Q90.jpg_.webp",
          name: "2021新款休闲短袖男简约百搭文艺风宽松男士t恤潮牌潮流夏装衣服",
          price: 300
          // _id: 1
        },
        {
          coverImg:
            "https://g-search2.alicdn.com/img/bao/uploaded/i4/i2/3007404718/O1CN01KcU00H1kitJZYKIvA_!!3007404718.jpg_580x580Q90.jpg_.webp",
          name: "李宁短袖女夏季2021新款休闲大码白色体恤半袖情侣装运动T恤",
          price: 2100
          // _id: 2
        },
        {
          coverImg:
            "https://g-search1.alicdn.com/img/bao/uploaded/i4/imgextra/i3/119293643/O1CN01pUFTzD1cmXXUiVQhQ_!!0-saturn_solar.jpg_580x580Q90.jpg_.webp",
          name: "创意家居用品用具小百货厨房居家生活日用品家用物件实用神器礼品",
          price: 3200
          // _id: 3
        },
        {
          coverImg:
            "https://img.alicdn.com/bao/uploaded/i2/1754594221/O1CN01wPJUIQ1h3GSjlBh7U_!!1754594221.jpg_200x200q90.jpg_.webp",
          name: "新品老式炒锅家用饭店有耳熟铁炒锅加厚无涂层锅具猛火灶特价包邮",
          price: 3200
          // _id: 4
        },
        {
          coverImg:
            "https://img.alicdn.com/imgextra/i3/700459267/O1CN01ga1mwD2IKL2CVvDC1_!!700459267.png_240x240q90.jpg",
          name: "2021新款休闲短袖男简约百搭文艺风宽松男士t恤潮牌潮流夏装衣服",
          price: 700
          // _id: 1
        },
        {
          coverImg:
            "https://img.alicdn.com/tfs/TB1Cq1HekvoK1RjSZPfXXXPKFXa-502-380.jpg_240x240q90.jpg",
          name: "壹加衣加 秋装网红款圆领豹纹印花连衣裙+纯色高级感吊带背心",
          price: 500
          // _id: 2
        },
        {
          coverImg:
            "https://img.alicdn.com/bao/uploaded/i2/75616105/O1CN01dGoPmG1uy8SpVNJzi_!!75616105.jpg_200x200q90.jpg_.webp",
          name: "【进口】韩国乐天爱情美女石榴果汁饮料180ml*15听礼盒包装盒",
          price: 3200
          // _id: 3
        },
        {
          coverImg:
            "https://gd2.alicdn.com/imgextra/i1/178651883/TB267QInol7MKJjSZFDXXaOEpXa_!!178651883.jpg_400x400.jpg",
          name: "【进口】韩国乐天爱情美女石榴果汁饮料180ml*15听礼盒包装盒",
          price: 3200
          // _id: 4
        },
        {
          coverImg:
            "https://img.alicdn.com/bao/uploaded/i1/1845023737/O1CN01dXMc0r1dTad1Uxhys_!!1845023737.jpg_200x200q90.jpg_.webp",
          name: "西班牙进口 歌伦初榨橄榄油1000ml/瓶食用油煎炒烹炸煮",
          price: 2500
          // _id: 1
        },
        {
          coverImg:
            "https://img.alicdn.com/bao/uploaded/i1/2742382596/O1CN01qCZi8Z1V30hfX75mZ_!!2742382596.jpg_200x200q90.jpg_.webp",
          name: "洗米筛淘米盆家用洗菜篮盆塑料沥水篮洗水果盆淘米篮收纳篮洗菜盆",
          price: 4200
          // _id: 2
        },
        {
          coverImg:
            "https://img.alicdn.com/bao/uploaded/i2/195728501/TB2n9dgsXXXXXXzXpXXXXXXXXXX_!!195728501.jpg_200x200q90.jpg_.webp",
          name: "包邮新鲜纯水果茶包干茶果粒花果茶冷热泡12包礼盒袋装健康玻璃杯",
          price: 1400
          // _id: 3
        },
        {
          coverImg:
            "https://img.alicdn.com/bao/uploaded/i2/195728501/TB2n9dgsXXXXXXzXpXXXXXXXXXX_!!195728501.jpg_200x200q90.jpg_.webp",
          name: "包邮新鲜纯水果茶包干茶果粒花果茶冷热泡12包礼盒袋装健康玻璃杯",
          price: 1400
          // _id: 4
        },
        {
          coverImg:
            "https://img.alicdn.com/bao/uploaded/i2/195728501/TB2n9dgsXXXXXXzXpXXXXXXXXXX_!!195728501.jpg_200x200q90.jpg_.webp",
          name: "包邮新鲜纯水果茶包干茶果粒花果茶冷热泡12包礼盒袋装健康玻璃杯",
          price: 1400
          // _id: 5
        },
        {
          coverImg:
            "https://img.alicdn.com/imgextra/i3/2940017781/TB1faCcqStYBeNjSspaXXaOOFXa_!!0-item_pic.jpg_430x430q90.jpg",
          name: "日式玻璃小碟子调料酱料醋油蘸料碟家用餐厅创意小吃泡菜火锅碟盘",
          price: 1400
          // _id: 6
        }
      ];
      teo.push(temP);
      teo.forEach((v, i) => {
        products.push(v);
      });
      // products = [temP];

      //   console.log(products);
      Product.insertMany(products);
      console.log("插入成功");
    });
});
