import { ChartType } from './enums';
import type { ItemData } from './types';
import { getData } from './utils';

/**
 * Класс для работы с IndexedDB
 */
export default class IndexedDbClass {
    db:IDBDatabase | null;
    dbName:string;
    dbVersion:number;

    /**
     * @param dbName IndexedDB name
     */
    constructor(dbName: string) {
        this.db = null;
        this.dbName = dbName;
        this.dbVersion = 1;
    }

    /**
     * Открываем соединение с БД
     * @param cb Коллбэк для дальнейшей обработки
     */
    open(cb: ()=>void) {
        if (!window.indexedDB) {
            console.log("Браузер на поддерживает IndexedDB");
        }
        let openRequest = window.indexedDB.open(this.dbName, this.dbVersion);

        openRequest.onsuccess = (e:Event) => {
            this.db = openRequest.result;
            cb();
        };

        openRequest.onerror = (e:Event) => {
            console.log("Error");
        };

        openRequest.onupgradeneeded = (e:IDBVersionChangeEvent) => {
            const target:IDBOpenDBRequest = e.target as IDBOpenDBRequest;
            this.db = target.result;
            this.db.createObjectStore(ChartType.TEMP, {keyPath: 't'});
            this.db.createObjectStore(ChartType.PREC, {keyPath: 't'});
            if(target.transaction){
                target.transaction.oncomplete = () => {
                    cb();
                };
            }
        };
    }

    /**
     * Закрываем соединение с БД
     */
    close(){
        this.db?.close();
    }

    /**
     * Добавляем новый элемент в БД
     * @param storeName Таблица
     * @param data Единица данных
     */
    add(storeName: string, data: ItemData) {
        if (this.db && data) {
            let transaction = this.db.transaction(storeName, "readwrite");
            let request = transaction.objectStore(storeName).add(data);
            request.onsuccess = (e:Event) => {
                
            };
        }
    }

    /**
     * Получаем данные из БД
     * @param storeName Таблица
     * @param start Начальнй интервал выборки
     * @param end Конечный интервал выборки
     * @param cb Колбэк с результатами запроса
     */
    get(storeName: string, start: string, end: string, cb: (data:ItemData[])=>void) {
        if (this.db) {
            const txn = this.db.transaction(storeName, "readonly");
            const objectStore = txn.objectStore(storeName);
            let request = objectStore.getAll(IDBKeyRange.bound(start, end));

            request.onsuccess = (e:Event) => {
                cb((<IDBRequest>e.target).result);
            };

            request.onerror = (e:Event) => {
                cb([]);
            };
        }
    }

    /**
     * Получаем  все записи из БД
     * @param storeName Таблица
     * @param cb Колбэк с результатами запроса
     */
    getAll(storeName: string, cb: (data:ItemData[])=>void) {
        if (this.db) {
            const txn = this.db.transaction(storeName, "readonly");
            const objectStore = txn.objectStore(storeName);
            let results:ItemData[] = [];
            objectStore.openCursor().onsuccess = (e) => {
                let cursor = (<IDBRequest>e.target).result;
                if (cursor) {
                    results.push(cursor.value);
                    cursor.continue();
                }
            };

            txn.oncomplete = function () {
                cb(results);
            };
        }
    }

    /**
     * Загружаем данные с сервера и записываем их в БД
     * @param storeName Таблица
     * @param cb Колбэк с результатами запроса
     */
    async getData(storeName: string, cb: (data:ItemData[])=>void) {
        let data = await getData<ItemData>(`../data/${storeName}.json`);
        cb(data);
        let request = this.db!.transaction(storeName, "readwrite").objectStore(storeName).clear();
        request.onsuccess = (e: Event) => {
            let transaction = this.db!.transaction(storeName, "readwrite");
            data.map((item:ItemData)=>{
                transaction.objectStore(storeName).add(item);
            });
            transaction.oncomplete = (e:Event) => {

            }
        }
    }
}