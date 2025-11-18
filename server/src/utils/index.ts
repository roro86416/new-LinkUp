// server/src/utils/index.ts
// 這隻檔案的目的是統一出口（barrel file）──方便匯入大家寫的所有公用工具，而不用寫長長的路徑，簡化 import，保持整潔。
/* How to use:
1. 若沒有 index.ts，每次都要：
import { getDateRange } from "../../utils/dateRange.js";
import { formatPrice } from "../../utils/formatPrice.js";

2. 有了 index.ts 後只要：
import { getDateRange, formatPrice } from "../../utils/index.js";
*/

// export * from "./dateRange.js";
// 之後若有其他工具，只要加一行即可
// export * from "./formatPrice.js";
