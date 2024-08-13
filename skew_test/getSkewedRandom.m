function randomValue = getSkewedRandom(minVal, maxVal, skew)
    % Generate a random number between 0 and 1
    u = rand();
    
    % Adjust the skewness
    skewFactor = abs(skew);
    randomSkewed = u^(1 / skewFactor);
    
    % Map the skewed value to the desired range
    if skew > 0
        randomSkewed = 1 - randomSkewed;
    end
    
    % Scale and translate the skewed value to the [minVal, maxVal] range
    scaledRandom = minVal + (randomSkewed * (maxVal - minVal));
    
    % Round to the nearest integer and ensure the upper bound is included
    randomValue = round(scaledRandom);
    
    % Ensure the value is within the specified range
    randomValue = max(minVal, min(randomValue, maxVal));
end
