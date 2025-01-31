export function getLuckyNumber(n, max = 99) {
    const arr = [];
    while (arr.length<n){
        const rnd = 1 + Math.floor(Math.random() * max)
        if (!arr.includes(rnd)){
            arr.push(rnd);
        }
    }
    return new Set(arr);
}
export function getTreasureChest(n, luckyNumbers, odds) {
    const result = {};  // 使用 const 或 let 初始化物件
    const nums = [100, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000];

    let visited = [];
    // 根據 luckyNumbers 和 odds 處理隨機數字
    for (let i = 0; i < luckyNumbers.length; i++) {
        if (Math.random() < odds / luckyNumbers.length) {
            result[luckyNumbers[i]] = drawByProbability(nums);
        }
        visited.push(luckyNumbers[i])
    }

    nums.push(0)
    // 確保 result 物件的鍵數量達到 n
    while (Object.keys(result).length < n) {
        const rnd = Math.floor(1 + Math.random() * 99);  // 生成 1 到 99 之間的隨機整數

        if (!visited.includes(rnd)) {  // 如果該隨機數字沒有在 result 物件中
            result[rnd] = nums[Math.floor(Math.random()*nums.length)];  // 設定為 0，或其他需要的預設值
        }
    }

    // 打亂 result 物件的順序
    const shuffledResult = Object.entries(result)
        .sort(() => Math.random() - 0.5)  // 隨機排序
        .reduce((acc, [key, value]) => {
            acc[key] = value;  // 重新構建物件
            return acc;
        }, {});

    return shuffledResult;  // 返回打亂後的結果物件
}


function drawByProbability(nums) {
    const sum = nums.reduce((acc, num) => acc + num, 0); // 計算總和
    const probabilities = nums.map(num => nums[nums.length-nums.indexOf(num)-1]/ sum); // 計算每個數字的機率
  
    // 依照機率生成一個區間
    let cumulativeProbabilities = [];
    let cumulativeSum = 0;
    for (let i = 0; i < probabilities.length; i++) {
      cumulativeSum += probabilities[i];
      cumulativeProbabilities.push(cumulativeSum);
    }
    // 生成一個隨機數，範圍是 [0, 1)
    const randomValue = Math.random();
  
    // 根據隨機數選擇對應的數字
    for (let i = 0; i < cumulativeProbabilities.length; i++) {
      if (randomValue < cumulativeProbabilities[i]) {
        return nums[i]; // 回傳抽中的數字
      }
    }
  }
