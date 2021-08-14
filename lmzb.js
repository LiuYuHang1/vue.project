const axios = require("axios").default;
const mongoose = require("mongoose");
const { Product, ProductCategory } = require("./models/index");

const categories = [
  {
    id: 1,
    name: "雕塑手办",
    link:
      "https://apps.game.qq.com/daoju/v3/zb/client/goods/GoodsApp.php?output_format=json&biz=lolriotmall&page_no=1&page_size=50&order_by=iRecRank&sort=desc&jsonpName=goodsListApi&opt_type=goods_list&cat_tag_id=101&cat_tag_type=cat&channel=2",
    img:
      "https://game.gtimg.cn/images/zb/x5/uploadImg/goods/201712/20171205200207_77656.big.jpg"
  },
  {
    id: 2,
    name: "毛绒玩偶",
    link:
      "https://apps.game.qq.com/daoju/v3/zb/client/goods/GoodsApp.php?output_format=jsonp&biz=lolriotmall&page_no=1&page_size=199&order_by=iRecRank&sort=desc&jsonpName=goodsListApi&opt_type=goods_list&cat_tag_id=119&cat_tag_type=cat&channel=2",
    img:
      "https://game.gtimg.cn/images/zb/x5/uploadImg/goods/202101/20210120214843_39472.big.jpg"
  },
  {
    id: 3,
    name: "男女服饰",
    link:
      "https://apps.game.qq.com/daoju/v3/zb/client/goods/GoodsApp.php?output_format=jsonp&biz=lolriotmall&page_no=1&page_size=199&order_by=iRecRank&sort=desc&jsonpName=goodsListApi&opt_type=goods_list&cat_tag_id=120&cat_tag_type=cat&channel=2",
    img:
      "https://game.gtimg.cn/images/zb/x5/uploadImg/goods/202104/20210409175934_45107.big.jpg"
  },
  {
    id: 4,
    name: "生活周边",
    link:
      "https://apps.game.qq.com/daoju/v3/zb/client/goods/GoodsApp.php?output_format=jsonp&biz=lolriotmall&page_no=1&page_size=199&order_by=iRecRank&sort=desc&jsonpName=goodsListApi&opt_type=goods_list&cat_tag_id=665&cat_tag_type=cat&channel=2",
    img:
      "https://game.gtimg.cn/images/zb/x5/uploadImg/goods/202101/20210118181726_94604.big.jpg"
  }
];

async function loadProducts(lmfl) {
  console.log(111);
  const c = categories.find((item) => (item.name = lmfl.name));
  const res = await axios.get(c.link);
  const products = res.data.data.list.map((item) => {
    return {
      name: item.sMallName,
      price: item.iPrice / 100,
      coverImg: item.sProfileImg,
      quantity: item.iSoldNum,
      productCategory: lmfl.id,
      content: "lmzb-" + item.iMallId
    };
  });
  await Product.insertMany(products);
  loadDetailInfo();
}

async function loadDetailInfo() {
  // console.log("---");
  const products = await Product.find({
    content: new RegExp("lmzb-")
  });
  for (let i = 0; i < products.length; i++) {
    const res = await axios
      .get(
        "https://apps.game.qq.com/daoju/v3/zb/client/goods/GoodsApp.php?output_format=json&opt_type=goods_detail&biz=lolriotmall&mall_id=" +
          products[i].content.replace("lmzb-", "")
      )
      .catch((err) => console.log(err));
    let strContent = res.data.data.list.sMallDesc.replace(
      new RegExp("//shp", "g"),
      "http://shp"
    );

    await Product.findByIdAndUpdate(products[i].id, {
      content: strContent
    });
    console.log("修复详情数据成功");
  }
  console.log("修复所有详情数据成功");
}

async function initCategories() {
  const lmfz = categories.map((item) => {
    return {
      name: item.name,
      coverImg: item.img,
      tag: "lmzb"
    };
  });
  await ProductCategory.deleteMany({ tag: "lmzb" });
  await ProductCategory.insertMany(lmfz);
  const lmfl = await ProductCategory.find({ tag: "lmzb" });
  for (var i = 0; i < lmfl.length; i++) {
    await loadProducts(lmfl[i]);
  }
}

mongoose
  .connect("mongodb://localhost:27017/cat-shop", {
    useNewUrlParser: true
  })
  .then((res) => {
    console.log("数据库连接成功");
    initCategories();
  })
  .catch((err) => {
    console.log(err);
  });
