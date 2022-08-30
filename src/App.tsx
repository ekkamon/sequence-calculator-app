import React, { FormEvent, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { ImArrowDown } from 'react-icons/im';

enum AnswerType {
  Arithmetic = 1,
  Geometric = 2,
}

interface IAnswer {
  state: boolean;
  query: {
    a1: number;
    a2: number;
    a3: number;
    aEnd: number;
  };
  d: number;
  n: number;
  aTotal: number;
  aList: Array<number>;
  aN: number;
  type: AnswerType;
}

const initAnswer = {
  state: false,
  query: {
    a1: 0,
    a2: 0,
    a3: 0,
    aEnd: 0,
  },
  d: 0,
  n: 0,
  aTotal: 0,
  aList: [],
  aN: 0,
  type: 0,
};

const App: React.FC = () => {
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<IAnswer>(initAnswer);
  const [aN, setAN] = useState<number>(1);

  const resetAnswer = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setAnswer(initAnswer);
    setQuestion('');
  };

  const findAnswer = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!question) {
      return alert('กรุณากรอกโจทย์ที่ต้องการหาคำตอบ');
    }

    let getQury: Array<any> = question.split(',');

    if (getQury.length < 5) {
      return alert('กรอกข้อมูลไม่ถูกต้อง /n ตัวอย่าง 2, 4, 6, ..., 100');
    }

    // remove ...
    getQury.splice(3, 1);

    // convert string to number
    getQury = getQury.map((i) => Number(i.replace(' ', '')));

    const [a1, a2, a3, aEnd]: Array<number> = getQury;

    // check is เลขคณิต or เรขาคณิต
    if (a2 - a1 === a3 - a2) {
      //เลขคณิต aN = a1 + (n - 1) * d

      let d: number = a2 - a1;
      let n: number = 0;
      let r: number = a1 + -1 * d;

      if (r >= 0) {
        n = (aEnd - r) / d;
      } else {
        n = (aEnd - r) / d;
      }

      let aTotal: number = (n / 2) * (a1 + aEnd);
      let aList: Array<number> = [];

      let sum: number = a1;
      for (let i = 1; i <= n; i++) {
        if (i > 1) sum += d;
        aList = [...aList, sum];
      }

      setAnswer({
        state: true,
        query: { a1, a2, a3, aEnd },
        d,
        n,
        aTotal,
        aList,
        aN: 0,
        type: AnswerType.Arithmetic,
      });
    } else if (a2 / a1 === a3 / a2) {
      //เรขาคณิต aN = a1 * r ^ n - 1

      let r: number = a2 / a1;
      let aN: number = aEnd / a1;
      let n: number = 0;

      // aN = r ** (n - 1)
      let ans: number = 0;
      for (let i = 0; ans !== aN; i++) {
        ans = r ** (i - 1);

        if (i >= 1000) {
          return alert('ไม่สามารถคิดข้อนี่ได้กรุณาเช็คโจทย์');
        }

        if (ans === aN) {
          n = i;
          break;
        }
      }

      let aTotal = (aEnd * r - a1) / (r - 1);
      let aList: Array<number> = [];

      let sum: number = a1;
      for (let i = 1; i <= n; i++) {
        if (i > 1) sum *= r;
        aList = [...aList, sum];
      }

      setAnswer({
        state: true,
        query: { a1, a2, a3, aEnd },
        d: r,
        n,
        aTotal,
        aList,
        aN: 0,
        type: AnswerType.Geometric,
      });
    } else {
      return alert('ขออภัยไม่สามารถคิดโจทย์ข้อนี้ได้');
    }
  };

  return (
    <div className='p-4 grid place-items-center'>
      <div className='block lg:w-6/12	 w-full'>
        <div className='relative'>
          <div className='flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none'>
            <FiSearch />
          </div>
          <input
            type='text'
            className='block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300'
            placeholder='ตัวอย่าง 2, 4, 6, ..., 100'
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
          <button
            type='submit'
            className='text-white absolute right-2.5 bottom-2.5 rounded-lg text-sm px-4 py-2 bg-blue-700 hover:bg-blue-800'
            onClick={findAnswer}
          >
            หาคำตอบ
          </button>
        </div>
        {answer.state ? (
          <>
            {/* หาพจที่เท่าไหร่ ? */}
            <div className='block grid justify-center'>
              <ImArrowDown className='mt-5 mb-5 text-xl' />
            </div>
            <div className='block border bg-gray-50 rounded w-full p-4'>
              <div className='mb-3'>
                <span className='font-bold mr-2 '>โจทย์ข้อนี้เป็นลำดับ :</span>
                {answer.type === AnswerType.Arithmetic ? 'เลขคณิต' : 'เรขาคณิต'}
              </div>
              <span className='font-bold mr-2 '>พจน์ที่ </span>
              <input
                type='number'
                className='bg-gray-50 border rounded text-center w-10'
                value={aN}
                onChange={(e) =>
                  Number(e.target.value) <= answer.n &&
                  setAN(Number(e.target.value))
                }
              />
              <span className='font-bold ml-2 '>
                คือ {answer.aList[aN - 1]}
              </span>
            </div>
            {/* แสดงคำตอบทั่วไป */}
            <div className='block grid justify-center'>
              <ImArrowDown className='mt-5 mb-5 text-xl' />
            </div>
            <div className='block border bg-gray-50 rounded w-full p-4'>
              <div className='mb-3'>
                <span className='font-bold'>จากสูตร : </span>
                {answer.type === AnswerType.Arithmetic
                  ? 'a1 + (n - 1)d'
                  : 'a1 * r ^ (n-1)'}
              </div>
              <div className='mb-3'>
                <span className='font-bold'>
                  {answer.type === AnswerType.Arithmetic
                    ? 'ผลต่างร่วม : '
                    : 'อัตราส่วนร่วม : '}
                </span>
                {answer.query.a2}
                {answer.type === AnswerType.Arithmetic ? '-' : '÷'}
                {answer.query.a1} = {answer.d}
              </div>
              <div className='mb-3'>
                <span className='font-bold'>ผลรวมของพจน์ทั้งหมด : </span>
                {answer.aTotal}
              </div>
              <div className='mb-3'>
                <span className='font-bold'>มีพจน์ทั้งหมด : </span>
                {answer.n} ตัว
              </div>
              <div className='grid-container grid grid-cols-8 gap-4 '>
                {answer.aList.map((value) => {
                  return (
                    <div
                      className='block border text-center rounded'
                      key={value}
                    >
                      {value}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className='block text-center mt-5'>
              <button
                type='submit'
                className='text-white rounded text-sm px-4 py-2 bg-red-700 hover:bg-red-800'
                onClick={resetAnswer}
              >
                รีเซ็ตคำตอบ
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default App;
