## Feats
1. add home page style
2. content: title:中央政府總預算案審查監督平台, banner:public/image/homepage-banner.svg, content:"收錄歷年及最新中央政府預算審議情形，包含立委提案刪減和凍結的緣由和金額，便於搜尋及比較，更能即時追蹤最新審議進度。還可透過視覺化方式瀏覽，一目暸然。除了已數位化的資料，此平台也透過群眾協力（crowdsourcing）辨識提案掃描檔，歡迎至協作區加入合作行列。", 4 buttons: 歷年預算(link to index("routes/home.tsx"),), 最新年度預算(link to #), 視覺化專區(link to route("/visualization", "visualization/index.tsx"),), 協作區(創造一個新的route，給你取名跟設計)
3. mobile ver: flex, flex-col, gap-y-9, button(border:3px solid #E9808E bg-white, onSelected:bg-[#E9808E] )