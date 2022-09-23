import React, { FormEvent, useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { FiSearch } from 'react-icons/fi';
import { ImArrowDown } from 'react-icons/im';

import AlertImage from './assets/images/alert.png';

enum AnswerType {
  Arithmetic = 1,
  Geometric = 2,
  AtrithWordmetic = 3,
  GeometricWordmetic = 4,
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

let initAnswer = {
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

const MySwal = withReactContent(Swal);

const App: React.FC = () => {
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<IAnswer>(initAnswer);
  const [aN, setAN] = useState<number>(1);
  const [isAlert, setIsAlert] = useState<boolean>(false);

  // alert popup
  if (!isAlert) {
    Swal.fire({
      imageUrl: AlertImage,
      confirmButtonText: 'กดเพื่อเข้าใช้งาน App',
      confirmButtonColor: '#1e40af',
    }).then((result) => {
      if (result?.isConfirmed) {
        setIsAlert(true);
      }
    });
  }

  const resetAnswer = (resetQuiz = false) => {
    if (resetQuiz) {
      setQuestion('');
    }

    setAnswer(initAnswer);
    setAN(1);
  };

  const findAnswer = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!question) {
      return alert('กรุณากรอกโจทย์ที่ต้องการหาคำตอบ');
    }

    resetAnswer();

    let getQury: Array<any> = question.split(',');

    if (getQury.length < 4) {
      return alert(
        'กรอกข้อมูลไม่ถูกต้อง /n ตัวอย่าง 2, 4, 6, ..., 100 /n 1, 3, 5, ...'
      );
    }

    // remove ...
    getQury.splice(3, 1);

    // convert string to number
    getQury = getQury.map((i) => Number(i.replace(' ', '')));

    const [a1, a2, a3, aEnd]: Array<number> = getQury;
    let word = 0;

    if (!aEnd) {
      await MySwal.fire({
        icon: 'question',
        title: 'พจน์ที่คุณต้องการหา ?',
        input: 'number',
      }).then((result) => {
        if (!result.isConfirmed) return;

        word = result.value;
      });
    }

    if (a2 - a1 === a3 - a2) {
      //เลขคณิต aN = a1 + (n - 1) * d
      let d: number = a2 - a1;

      if (!aEnd) {
        let _aN = a1 + (word - 1) * d;

        setAN(word);
        setAnswer({
          state: true,
          query: { a1, a2, a3, aEnd },
          d,
          n: 1000,
          aTotal: 0,
          aList: [],
          aN: _aN,
          type: AnswerType.AtrithWordmetic,
        });
      } else {
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
          aN: a1 + (1 - 1) * d,
          type: AnswerType.Arithmetic,
        });
      }
    } else if (a2 / a1 === a3 / a2) {
      //เรขาคณิต aN = a1 * r ^ n - 1

      let r: number = a2 / a1;

      if (!aEnd) {
        let _aN = a1 * r ** (word - 1);

        setAN(word);
        setAnswer({
          state: true,
          query: { a1, a2, a3, aEnd },
          d: r,
          n: 1000,
          aTotal: 0,
          aList: [],
          aN: _aN,
          type: AnswerType.GeometricWordmetic,
        });
      } else {
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

        // find aN

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
          aN: a1 * r ** (1 - 1),
          type: AnswerType.Geometric,
        });
      }
    } else {
      return alert('ขออภัยไม่สามารถคิดโจทย์ข้อนี้ได้');
    }
  };

  const onChangeAN = (e: FormEvent<HTMLInputElement>) => {
    const value = Number(e.currentTarget.value);
    if (value > answer.n || value < 1) return;

    setAN(value);
    let newValue: IAnswer = answer;

    if (
      answer.type === AnswerType.Arithmetic ||
      answer.type === AnswerType.AtrithWordmetic
    ) {
      newValue.aN = answer.query.a1 + (value - 1) * answer.d;
      setAnswer(newValue);
    } else {
      newValue.aN = answer.query.a1 * answer.d ** (value - 1);
      setAnswer(newValue);
    }
  };

  const solArithmetic = () => {
    const value = answer.d * -1 + answer.query.a1;

    return value !== 0 ? value : '';
  };

  return (
    <div className='p-4 grid place-items-center'>
      <div className='block lg:w-6/12	 w-full'>
        <div className='mb-5 relative'>
          <div className='flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none'>
            <FiSearch />
          </div>
          <input
            type='text'
            className='block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300'
            placeholder='ตัวอย่าง 2, 4, 6, ..., 100 หรือ 1, 3, 5, ...'
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
              <ImArrowDown className='mb-5 text-xl' />
            </div>
            <div className='block border bg-gray-50 rounded w-full p-4'>
              <div className='mb-3'>
                <span className='font-bold mr-2 '>โจทย์ข้อนี้เป็นลำดับ :</span>

                {answer.type === AnswerType.Arithmetic ||
                answer.type === AnswerType.AtrithWordmetic
                  ? 'เลขคณิต'
                  : 'เรขาคณิต'}
              </div>
              <span className='font-bold mr-2 '>พจน์ที่ </span>
              <input
                type='number'
                className='bg-gray-50 border rounded text-center w-10'
                value={aN}
                onChange={onChangeAN}
              />
              <span className='font-bold ml-2 '>คือ {answer.aN}</span>
            </div>
            <div className='block grid justify-center'>
              <ImArrowDown className='mt-5 mb-5 text-xl' />
            </div>
            {answer.type === AnswerType.AtrithWordmetic ||
            answer.type === AnswerType.GeometricWordmetic ? (
              // คำตอบที่ให้หาพจน์ทั่วไป
              <>
                <div className='block border bg-gray-50 rounded w-full p-4'>
                  <div className='mb-3'>
                    <span className='font-bold'>จากสูตร : </span>
                    {answer.type === AnswerType.AtrithWordmetic
                      ? 'a1 + (n - 1)d'
                      : 'a1 * r ^ (n-1)'}
                  </div>
                  <div className='mb-3'>
                    <span className='font-bold'>ผลต่างร่วม : </span>
                    {answer.query.a2} - {answer.query.a1} = {answer.d}
                  </div>
                  <div>
                    <span className='font-bold'>วิธีทำ : </span>
                  </div>
                  <div className='ml-5'>
                    {answer.type === AnswerType.AtrithWordmetic ? (
                      <>
                        <p>
                          aN = ({answer.query.a1}) + (n-1)({answer.d})
                        </p>
                        <p>
                          aN = {answer.d}n{solArithmetic()}
                        </p>
                      </>
                    ) : (
                      <>
                        <p>
                          aN = ({answer.query.a1}) * {answer.d}^(n - 1)
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </>
            ) : (
              // คำตอบที่ใส่ aEnd มา
              <>
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
              </>
            )}
            <div className='block text-center mt-5'>
              <button
                type='submit'
                className='text-white rounded text-sm px-4 py-2 bg-red-700 hover:bg-red-800'
                onClick={() => resetAnswer(true)}
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
