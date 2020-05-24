import time

def check_user_input(n):
    if int(n) is not n:
        raise ValueError('given number is floating point!!! Please enter only integers')
    if n <= 0:
        raise ValueError('Given must be positive')


def eratostenes(n):
    try:
        check_user_input(n)
    except ValueError:
        return 
    
    numbers = [True for i in range(2, n + 2)]

    start1 = time.perf_counter()

    i = 2
    while i*i <= n:
        if numbers[i] is True:
            k = 2*i
            while k < n:
                numbers[k] = False
                k += i
        i += 1


    finish1 = time.perf_counter()

    print('eratostenes loops: ' + str(finish1 - start1))

    start2 = time.perf_counter()

    with open('result.txt', 'w') as f:
        num_iter = numbers.__iter__()
        for val, is_prime in enumerate(numbers):
            if is_prime: f.write(str(val) + '\n')

    finish2 = time.perf_counter()
    print('file writting: ' + str(finish2 - start2))
    print('total : ' + str(finish2 - start1))


if __name__ == '__main__':
    n = int(input('Please enter upper border for primes:'))
    start = time.perf_counter()
    eratostenes(100000000)
    finish = time.perf_counter()

    print(str(finish - start) + '\n')