import { fromEvent, Subject } from 'rxjs'
import { filter, map } from 'rxjs/operators'

/**
 * RxJS 三個步驟：
    建立新的 Observable
    使用 Operators 來組合/轉換 Observables
    訂閱 Observable
 */

/**
 * 畫面包含四個按鈕：
    「開始新的計數器」按鈕：重新建立一個新的計數器，必須使用 new Subject() 來建立；並在「目前狀態」資訊顯示「開始計數」。
    「計數」按鈕：當建立新的計數器後，每按下計數按鈕，顯示的計數值就加 1。
    「發生錯誤」按鈕：要求使用者輸入錯誤訊息，並將錯誤訊息顯示在「目前狀態」資訊內。
    「完成計數」按鈕：在「目前狀態」資訊顯示「完成」
 */
// 步驟1：HTML 結構與 DOM 預處理
// 按鈕 DOM
const startCountorBtn = document.getElementById('startCountorBtn') as HTMLElement
const counterBtn = document.getElementById('counterBtn') as HTMLElement
const errorBtn = document.getElementById('errorBtn') as HTMLElement
const completedBtn = document.getElementById('completedBtn') as HTMLElement

/**
 * 畫面必須顯示三個資訊：
    目前狀態：包含「開始計數」、「完成」和「錯誤」(包含錯誤訊息)。
    目前計數：當計數器建立後，顯示「計數」按鈕被點擊的次數。
    偶數計數：每當「目前計數」數值為偶數時，顯示這個偶數值。
 */
// 內容計數 DOM
const status = document.getElementById('status') as HTMLElement
const currentCount = document.getElementById('currentCount') as HTMLElement
const evenCount = document.getElementById('evenCount') as HTMLElement

// 步驟 2：實作「開始新的計數器」按鈕
// 建立 變數來儲存目前計數值，並顯示到畫面上
// 建立 subject 來通知計數器值改變
let count = 0
let counter$: Subject<number>

// 訂閱：「開始新的計數器」按鈕事件
fromEvent(startCountorBtn, 'click').subscribe(() => {
    // 初始化
    counter$ = new Subject()
    count = 0
    status.innerText = '開始計數'

    // 再建立一個新的「偶數計數值」的 Observable，關注點分離
    const evenCounter$ = counter$.pipe(filter((data) => data % 2 === 0))

    // 建立觀察者
    const counterObserver = {
        next: (data) => {
            currentCount.innerText = `${data}`
        },
        error: (message) => {
            status.innerText = `${message}`
        },
        complete: () => {
            status.innerText = '完成'
        },
    }

    // 訂閱：counter$ 並顯示目前計數值
    counter$.subscribe(counterObserver)

    // 訂閱：偶數 counter$ 並顯示目前計數值
    evenCounter$.subscribe((data) => {
        evenCount.innerText = `${data}`
    })

    // 送出預設值，讓畫面一開始為 0
    counter$.next(count)
})

// 步驟 3：實作「計數」按鈕
// 訂閱：「計數」按鈕事件包裝成 observable
fromEvent(counterBtn, 'click').subscribe((data) => {
    counter$.next(++count)
})

// 步驟 4：實作「發生錯誤」及「完成計數」按鈕
fromEvent(errorBtn, 'click').subscribe((data) => {
    const message = prompt('請輸入錯誤訊息')

    counter$.error(message || 'error')
})

fromEvent(completedBtn, 'click').subscribe(() => {
    counter$.complete()
})
