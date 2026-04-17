



def bubble_sort(arr):
    n = len(arr)
    # Traverse through all array elements
    for i in range(n):
        # Last i elements are already in place, so we ignore them
        for j in range(0, n - i - 1):
            # Compare adjacent elements
            if arr[j] > arr[j + 1]:
                # Swap if the element found is greater than the next
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                
    return arr

def fatorial(numero):
    if numero == 0 or numero == 1:
        return 1
    else:
        return numero * fatorial(numero - 1)

n_pro_fat = int(input())

res = fatorial(n_pro_fat)

print(res)





